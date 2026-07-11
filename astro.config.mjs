// @ts-check
import { defineConfig } from 'astro/config';

// Автоматически чинит пути к картинкам в Markdown
function remarkFixImagePaths() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'image' && node.url) {
        // Если ссылка не внешняя (http) и не начинается со слеша (/) или ./
        if (
          !node.url.startsWith('http') &&
          !node.url.startsWith('/') &&
          !node.url.startsWith('./')
        ) {
          node.url = './' + node.url; // Добавляем ./
        }
      }
      if (node.children) {
        node.children.forEach(walk);
      }
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
    // ... твои текущие настройки (integrations, server и т.д.)

  markdown: {
    remarkPlugins: [remarkFixImagePaths],
  },
});
