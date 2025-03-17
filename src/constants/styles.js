export const STYLES = {
     // Layout styles - สำหรับการจัดวางโครงสร้างหลักของหน้าเว็บ
     layout: {
          // จัดวาง wrapper หลักให้อยู่กึ่งกลางและเต็มความสูงหน้าจอ
          wrapper: 'flex flex-col justify-start items-center min-h-screen w-full',
          // กำหนดความกว้างของ container สำหรับ mobile และ desktop
          container: {
               mobile: 'w-[375px]',                    // ความกว้างคงที่สำหรับ mobile
               desktop: 'md:w-full sm:container mx-auto' // ปรับขนาดตาม breakpoint
          },
          // กำหนด grid layout สำหรับจัดเรียงเนื้อหา
          grid: 'grid grid-cols-1 md:grid-cols-12 gap-[16px] md:gap-[24px]', // 1 คอลัมน์บน mobile, 12 คอลัมน์บน desktop
          // จัดวางเนื้อหาในแนวตั้ง
          flex: 'flex flex-col justify-center'
     },

     // Spacing styles - ระยะห่างและ padding ต่างๆ
     spacing: {
          section: {
               // padding สำหรับ desktop เท่านั้น
               desktop: 'md:px-[120px] md:py-[60px]'
          },
          content: {
               // padding สำหรับเนื้อหาทั่วไป
               mobile: 'px-[16px] pt-[40px]',         // ลด padding ด้านบนบน mobile
               desktop: 'md:px-0 md:pt-0'             // ปรับ padding บน desktop
          }
     },

     // Typography styles - รูปแบบตัวอักษรต่างๆ
     typography: {
          heading: {
               // สไตล์พื้นฐานสำหรับหัวข้อ
               base: 'font-poppins font-semibold text-[#26231E]',
               // ขนาดตัวอักษรที่แตกต่างกันระหว่าง mobile และ desktop
               size: 'text-[40px] md:text-[52px] leading-[48px] md:leading-[60px]'
          },
          body: {
               // สไตล์พื้นฐานสำหรับเนื้อหา
               base: 'font-poppins font-medium text-[#75716B]',
               size: 'text-[16px] leading-[24px]'
          },
          label: {
               // สไตล์สำหรับ label ต่างๆ
               base: 'font-poppins font-medium text-[#75716B] text-left',
               size: 'text-[12px] leading-[20px]'
          }
     },

     // Component-specific styles - สไตล์เฉพาะของแต่ละ component
     components: {
          // Card component styles
          card: {
               base: 'bg-[#F9F8F8] rounded-lg',       // พื้นหลังและมุมโค้ง
               padding: 'p-[16px] md:p-6'             // padding ที่แตกต่างกันระหว่าง mobile และ desktop
          },
          // Image component styles
          image: {
               container: 'relative bg-[#FFFFFF] rounded-2xl overflow-hidden',
               size: {
                    mobile: 'w-[343px] h-[470px]',       // ขนาดภาพบน mobile
                    desktop: 'md:w-full md:h-[529px]'    // ขนาดภาพบน desktop
               },
               overlay: 'absolute inset-0 bg-[#BEBBB1] opacity-25 rounded-2xl'
          },
          // Navbar component styles
          navbar: {
               // โครงสร้างหลักของ navbar
               wrapper: 'fixed top-0 left-0 right-0 bg-[var(--background-color)] border-b border-[#DAD6D1] z-10',
               container: {
                    height: 'h-[48px] sm:h-[80px]',      // ความสูงที่แตกต่างกัน
                    padding: 'px-[24px] sm:px-8 lg:px-[120px]' // padding ที่แตกต่างกันตาม breakpoint
               },
               content: 'flex items-center justify-between',
               // Logo styles
               logo: {
                    wrapper: 'flex items-center',
                    image: 'w-[24px] h-[24px] sm:w-[44px] sm:h-[44px]' // ขนาดโลโก้ที่แตกต่างกัน
               },
               // Menu styles (mobile และ desktop)
               menu: {
                    mobile: {
                         button: 'block sm:hidden focus:outline-none', // แสดงเฉพาะบน mobile
                         dropdown: 'block sm:hidden bg-[var(--background-color)] border-b border-[#DAD6D1] px-[24px] py-4 absolute w-full',
                         buttons: 'flex flex-col gap-3'
                    },
                    desktop: {
                         wrapper: 'hidden sm:flex items-center gap-3' // แสดงเฉพาะบน desktop
                    }
               },
               // Button styles
               buttons: {
                    login: {
                         mobile: 'w-full h-[40px] btn-secondary text-sm font-medium flex items-center justify-center gap-[6px] py-2 px-6',
                         desktop: 'w-[130px] h-[48px] btn-secondary text-sm font-medium flex items-center justify-center gap-[6px] py-3 px-10'
                    },
                    signup: {
                         mobile: 'w-full h-[40px] btn-primary text-sm font-medium flex items-center justify-center gap-[6px] py-2 px-6',
                         desktop: 'w-[143px] h-[48px] btn-primary text-sm font-medium flex items-center justify-center gap-[6px] py-3'
                    }
               }
          }
     }
} 