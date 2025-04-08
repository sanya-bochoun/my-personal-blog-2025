const db = require('../config/db');
const { AppError, catchAsync } = require('../utils/errorHandler');
const slugify = require('slugify');

/**
 * ดึงรายการบทความทั้งหมด
 */
const getAllPosts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    search,
    author,
    sort = 'newest'
  } = req.query;

  const offset = (page - 1) * limit;
  let query = `
    SELECT 
      p.id, p.title, p.slug, p.excerpt, p.featured_image, 
      p.published_at, p.view_count,
      u.username AS author_name, u.avatar_url AS author_avatar,
      c.name AS category_name, c.slug AS category_slug,
      COUNT(DISTINCT pl.user_id) AS like_count,
      COUNT(DISTINCT cm.id) AS comment_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    LEFT JOIN comments cm ON p.id = cm.post_id AND cm.is_approved = true
    WHERE p.published = true
  `;

  const queryParams = [];
  let paramIndex = 1;

  // ตัวกรองตาม category
  if (category) {
    query += ` AND c.slug = $${paramIndex}`;
    queryParams.push(category);
    paramIndex++;
  }

  // ตัวกรองตาม tag
  if (tag) {
    query += `
      AND p.id IN (
        SELECT pt.post_id FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE t.slug = $${paramIndex}
      )
    `;
    queryParams.push(tag);
    paramIndex++;
  }

  // ตัวกรองตาม author
  if (author) {
    query += ` AND u.username = $${paramIndex}`;
    queryParams.push(author);
    paramIndex++;
  }

  // ค้นหา
  if (search) {
    query += `
      AND (
        p.title ILIKE $${paramIndex} OR
        p.content ILIKE $${paramIndex} OR
        p.excerpt ILIKE $${paramIndex}
      )
    `;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  // Group by
  query += ` GROUP BY p.id, u.username, u.avatar_url, c.name, c.slug`;

  // Sorting
  if (sort === 'newest') {
    query += ` ORDER BY p.published_at DESC`;
  } else if (sort === 'oldest') {
    query += ` ORDER BY p.published_at ASC`;
  } else if (sort === 'popular') {
    query += ` ORDER BY p.view_count DESC`;
  } else if (sort === 'most_comments') {
    query += ` ORDER BY comment_count DESC`;
  } else if (sort === 'most_likes') {
    query += ` ORDER BY like_count DESC`;
  }

  // Pagination
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);

  // ดึงข้อมูลบทความ
  const result = await db.query(query, queryParams);

  // ดึงจำนวนบทความทั้งหมด (สำหรับ pagination)
  let countQuery = `
    SELECT COUNT(DISTINCT p.id) FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.published = true
  `;

  // ใช้ filter เดียวกันกับ query หลัก
  for (let i = 0; i < paramIndex - 2; i++) {
    countQuery = countQuery.replace(`$${i + 1}`, `$${i + 1}`);
  }

  const countResult = await db.query(countQuery, queryParams.slice(0, paramIndex - 2));
  const totalPosts = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalPosts / limit);

  // ดึง tags สำหรับแต่ละบทความ
  for (const post of result.rows) {
    const tagsResult = await db.query(`
      SELECT t.name, t.slug FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = $1
    `, [post.id]);
    
    post.tags = tagsResult.rows;
  }

  res.json({
    status: 'success',
    data: {
      posts: result.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_posts: totalPosts,
        per_page: parseInt(limit)
      }
    }
  });
});

/**
 * ดึงข้อมูลบทความตาม slug
 */
const getPostBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  // เพิ่มจำนวนการดู
  await db.query(`
    UPDATE posts
    SET view_count = view_count + 1
    WHERE slug = $1 AND published = true
  `, [slug]);

  // ดึงข้อมูลบทความ
  const result = await db.query(`
    SELECT 
      p.id, p.title, p.slug, p.content, p.excerpt, p.featured_image, 
      p.published_at, p.view_count, p.created_at, p.updated_at,
      u.id AS author_id, u.username AS author_name, u.avatar_url AS author_avatar, u.bio AS author_bio,
      c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
      COUNT(DISTINCT pl.user_id) AS like_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    WHERE p.slug = $1 AND p.published = true
    GROUP BY p.id, u.id, c.id
  `, [slug]);

  if (result.rows.length === 0) {
    throw new AppError('ไม่พบบทความที่ต้องการ', 404);
  }

  const post = result.rows[0];

  // ดึง tags
  const tagsResult = await db.query(`
    SELECT t.name, t.slug FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = $1
  `, [post.id]);
  
  post.tags = tagsResult.rows;

  // ดึงความคิดเห็น
  const commentsResult = await db.query(`
    SELECT 
      c.id, c.content, c.created_at,
      u.id AS user_id, u.username, u.avatar_url,
      COUNT(cl.user_id) AS like_count
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN comment_likes cl ON c.id = cl.comment_id
    WHERE c.post_id = $1 AND c.parent_id IS NULL AND c.is_approved = true
    GROUP BY c.id, u.id
    ORDER BY c.created_at DESC
  `, [post.id]);

  post.comments = commentsResult.rows;

  // สำหรับแต่ละความคิดเห็น ดึงความคิดเห็นย่อย
  for (const comment of post.comments) {
    const repliesResult = await db.query(`
      SELECT 
        c.id, c.content, c.created_at,
        u.id AS user_id, u.username, u.avatar_url,
        COUNT(cl.user_id) AS like_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.parent_id = $1 AND c.is_approved = true
      GROUP BY c.id, u.id
      ORDER BY c.created_at ASC
    `, [comment.id]);
    
    comment.replies = repliesResult.rows;
  }

  // ตรวจสอบว่าผู้ใช้ปัจจุบันกดไลค์บทความนี้หรือไม่ (ถ้าล็อกอินอยู่)
  if (req.userId) {
    const likeResult = await db.query(`
      SELECT 1 FROM post_likes
      WHERE post_id = $1 AND user_id = $2
    `, [post.id, req.userId]);
    
    post.is_liked = likeResult.rows.length > 0;

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของบทความหรือไม่
    post.is_owner = post.author_id === req.userId;
  } else {
    post.is_liked = false;
    post.is_owner = false;
  }

  // ดึงบทความที่เกี่ยวข้อง (แนะนำ)
  const relatedResult = await db.query(`
    SELECT 
      p.id, p.title, p.slug, p.excerpt, p.featured_image, 
      p.published_at, p.view_count,
      u.username AS author_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.category_id = $1 AND p.id != $2 AND p.published = true
    ORDER BY p.published_at DESC
    LIMIT 3
  `, [post.category_id, post.id]);
  
  post.related_posts = relatedResult.rows;

  res.json({
    status: 'success',
    data: {
      post
    }
  });
});

/**
 * สร้างบทความใหม่
 */
const createPost = catchAsync(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    published
  } = req.body;

  // สร้าง slug จากชื่อบทความ
  const slug = slugify(title, {
    lower: true, // แปลงเป็นตัวพิมพ์เล็ก
    strict: true, // ลบอักขระพิเศษ
  });

  // ตรวจสอบว่า slug ซ้ำหรือไม่
  const slugCheck = await db.query('SELECT id FROM posts WHERE slug = $1', [slug]);
  if (slugCheck.rows.length > 0) {
    throw new AppError('ชื่อบทความซ้ำกับบทความอื่น', 400);
  }

  // เพิ่มบทความใหม่
  const result = await db.query(`
    INSERT INTO posts (
      title, slug, content, excerpt, featured_image,
      author_id, category_id, published,
      published_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [
    title,
    slug,
    content,
    excerpt || null,
    featured_image || null,
    req.userId,
    category_id || null,
    published || false,
    published ? new Date() : null
  ]);

  const newPost = result.rows[0];

  // เพิ่ม tags (ถ้ามี)
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      // ตรวจสอบว่า tag มีอยู่แล้วหรือไม่
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      let tagResult = await db.query('SELECT id FROM tags WHERE slug = $1', [tagSlug]);
      
      let tagId;
      
      if (tagResult.rows.length === 0) {
        // สร้าง tag ใหม่
        const newTagResult = await db.query(
          'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
          [tagName, tagSlug]
        );
        tagId = newTagResult.rows[0].id;
      } else {
        tagId = tagResult.rows[0].id;
      }

      // เชื่อมโยง tag กับบทความ
      await db.query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
        [newPost.id, tagId]
      );
    }
  }

  res.status(201).json({
    status: 'success',
    message: 'สร้างบทความสำเร็จ',
    data: {
      post: newPost
    }
  });
});

/**
 * อัปเดตบทความ
 */
const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    content,
    excerpt,
    featured_image,
    category_id,
    tags,
    published
  } = req.body;

  // ตรวจสอบว่าบทความมีอยู่หรือไม่
  const postCheck = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
  if (postCheck.rows.length === 0) {
    throw new AppError('ไม่พบบทความที่ต้องการแก้ไข', 404);
  }

  const post = postCheck.rows[0];

  // ตรวจสอบว่าผู้ใช้เป็นเจ้าของบทความหรือเป็น admin
  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    throw new AppError('คุณไม่มีสิทธิ์แก้ไขบทความนี้', 403);
  }

  // สร้าง slug ใหม่ถ้ามีการเปลี่ยนชื่อบทความ
  let slug = post.slug;
  if (title && title !== post.title) {
    slug = slugify(title, { lower: true, strict: true });
    
    // ตรวจสอบว่า slug ใหม่ซ้ำกับบทความอื่นหรือไม่
    const slugCheck = await db.query('SELECT id FROM posts WHERE slug = $1 AND id != $2', [slug, id]);
    if (slugCheck.rows.length > 0) {
      throw new AppError('ชื่อบทความซ้ำกับบทความอื่น', 400);
    }
  }

  // ตรวจสอบว่าบทความถูกเผยแพร่ใหม่หรือไม่
  let publishedAt = post.published_at;
  if (published && published !== post.published && !post.published_at) {
    publishedAt = new Date();
  }

  // อัปเดตบทความ
  const updateFields = [];
  const updateValues = [];
  let paramIndex = 1;

  if (title) {
    updateFields.push(`title = $${paramIndex}`);
    updateValues.push(title);
    paramIndex++;
  }

  if (slug !== post.slug) {
    updateFields.push(`slug = $${paramIndex}`);
    updateValues.push(slug);
    paramIndex++;
  }

  if (content) {
    updateFields.push(`content = $${paramIndex}`);
    updateValues.push(content);
    paramIndex++;
  }

  if (excerpt !== undefined) {
    updateFields.push(`excerpt = $${paramIndex}`);
    updateValues.push(excerpt || null);
    paramIndex++;
  }

  if (featured_image !== undefined) {
    updateFields.push(`featured_image = $${paramIndex}`);
    updateValues.push(featured_image || null);
    paramIndex++;
  }

  if (category_id !== undefined) {
    updateFields.push(`category_id = $${paramIndex}`);
    updateValues.push(category_id || null);
    paramIndex++;
  }

  if (published !== undefined) {
    updateFields.push(`published = $${paramIndex}`);
    updateValues.push(published);
    paramIndex++;
  }

  if (publishedAt !== post.published_at) {
    updateFields.push(`published_at = $${paramIndex}`);
    updateValues.push(publishedAt);
    paramIndex++;
  }

  // อัปเดตเวลาแก้ไข
  updateFields.push(`updated_at = $${paramIndex}`);
  updateValues.push(new Date());
  paramIndex++;

  // เพิ่ม ID ของบทความในพารามิเตอร์
  updateValues.push(id);

  const updateQuery = `
    UPDATE posts
    SET ${updateFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await db.query(updateQuery, updateValues);
  const updatedPost = result.rows[0];

  // อัปเดต tags ถ้ามีการเปลี่ยนแปลง
  if (tags && tags.length > 0) {
    // ลบ tags เดิม
    await db.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

    // เพิ่ม tags ใหม่
    for (const tagName of tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      let tagResult = await db.query('SELECT id FROM tags WHERE slug = $1', [tagSlug]);
      
      let tagId;
      
      if (tagResult.rows.length === 0) {
        const newTagResult = await db.query(
          'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
          [tagName, tagSlug]
        );
        tagId = newTagResult.rows[0].id;
      } else {
        tagId = tagResult.rows[0].id;
      }

      await db.query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
        [id, tagId]
      );
    }
  }

  res.json({
    status: 'success',
    message: 'อัปเดตบทความสำเร็จ',
    data: {
      post: updatedPost
    }
  });
});

/**
 * ลบบทความ
 */
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  // ตรวจสอบว่าบทความมีอยู่หรือไม่
  const postCheck = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
  if (postCheck.rows.length === 0) {
    throw new AppError('ไม่พบบทความที่ต้องการลบ', 404);
  }

  const post = postCheck.rows[0];

  // ตรวจสอบว่าผู้ใช้เป็นเจ้าของบทความหรือเป็น admin
  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    throw new AppError('คุณไม่มีสิทธิ์ลบบทความนี้', 403);
  }

  // ลบบทความ (ความสัมพันธ์อื่นๆ จะถูกลบโดยอัตโนมัติด้วย cascading delete)
  await db.query('DELETE FROM posts WHERE id = $1', [id]);

  res.json({
    status: 'success',
    message: 'ลบบทความสำเร็จ'
  });
});

/**
 * กดไลค์หรือยกเลิกไลค์บทความ
 */
const toggleLike = catchAsync(async (req, res) => {
  const { id } = req.params;

  // ตรวจสอบว่าบทความมีอยู่หรือไม่
  const postCheck = await db.query('SELECT id FROM posts WHERE id = $1', [id]);
  if (postCheck.rows.length === 0) {
    throw new AppError('ไม่พบบทความที่ต้องการ', 404);
  }

  // ตรวจสอบว่าผู้ใช้ได้กดไลค์บทความนี้ไปแล้วหรือไม่
  const likeCheck = await db.query(
    'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2',
    [id, req.userId]
  );

  let message;
  
  if (likeCheck.rows.length > 0) {
    // ถ้ากดไลค์ไปแล้ว ให้ยกเลิกไลค์
    await db.query(
      'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [id, req.userId]
    );
    message = 'ยกเลิกไลค์บทความสำเร็จ';
  } else {
    // ถ้ายังไม่ได้กดไลค์ ให้เพิ่มไลค์
    await db.query(
      'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
      [id, req.userId]
    );
    message = 'กดไลค์บทความสำเร็จ';
  }

  // ดึงจำนวนไลค์ปัจจุบัน
  const likesResult = await db.query(
    'SELECT COUNT(*) AS like_count FROM post_likes WHERE post_id = $1',
    [id]
  );

  res.json({
    status: 'success',
    message,
    data: {
      like_count: parseInt(likesResult.rows[0].like_count),
      is_liked: likeCheck.rows.length === 0
    }
  });
});

module.exports = {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike
}; 