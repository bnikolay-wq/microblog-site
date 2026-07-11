import fs from 'fs';
import path from 'path';

const blogDir = 'src/content/blog';
const publicDir = 'public/images';

// Создаем папку public/images, если её нет
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const files = fs.readdirSync(blogDir);

files.forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Ищем все картинки вида ![](имя.формат) и ![[имя.формат]]
    const regex = /!\[[^\]]*\]\(([^)]+)\)|!\[\[([^\]]+)\]\]/g;
    
    content = content.replace(regex, (match, mdUrl, wikiUrl) => {
      const src = mdUrl || wikiUrl;
      
      // Игнорируем внешние ссылки (http) и уже правильные пути (/images/...)
      if (src.startsWith('http') || src.startsWith('/') || src.startsWith('./')) {
        return match;
      }

      const imageName = path.basename(src);
      const oldImagePath = path.join(blogDir, imageName);
      const newImagePath = path.join(publicDir, imageName);

      // Если картинка реально лежит рядом с заметкой
      if (fs.existsSync(oldImagePath)) {
        // Переносим её в public/images
        fs.renameSync(oldImagePath, newImagePath);
        modified = true;
        // Возвращаем правильную ссылку
        return `![](/images/${imageName})`;
      }
      
      return match;
    });

    // Если мы что-то исправили, перезаписываем .md файл
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed images in: ${file}`);
    }
  }
});
console.log('🎉 Image fixer completed!');