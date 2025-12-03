# 🚀 Quick Deploy to Vercel

## Method 1: Via CLI (Fastest) ⚡

### Step 1: Login to Vercel
```bash
cd frontend
npx vercel login
```
Следуйте инструкциям для входа (email или GitHub)

### Step 2: Deploy to Vercel
```bash
npx vercel
```

При первом деплое ответьте на вопросы:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Выберите свой аккаунт
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `vote-d-21` (или любое имя)
- **In which directory is your code located?** → `./` (нажмите Enter)
- **Want to override the settings?** → `N` (No)

### Step 3: Deploy to Production
```bash
npx vercel --prod
```

✅ **Готово!** Вы получите URL типа: `https://vote-d-21.vercel.app`

---

## Method 2: Via GitHub + Vercel Dashboard 🌐

### Step 1: Commit and Push to GitHub
```bash
# В корневой директории проекта
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import в Vercel
1. Перейдите на https://vercel.com/
2. Нажмите **"Add New..."** → **"Project"**
3. Выберите ваш GitHub репозиторий
4. Настройте:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (автоопределение)
   - Остальное оставьте по умолчанию
5. Нажмите **"Deploy"**

✅ **Готово!** Ждите ~2-3 минуты пока соберётся

---

## Method 3: One-Click Deploy Button 🔘

1. Создайте кнопку в README:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_URL)
```

2. Замените YOUR_GITHUB_URL на URL вашего репозитория

---

## После деплоя

### Получите свой URL
Ваше приложение будет доступно по адресу:
```
https://your-project-name.vercel.app
```

### Протестируйте
1. Откройте URL
2. Подключите Phantom (установите на Devnet)
3. Получите SOL через кнопку "🪂 Get SOL"
4. Инициализируйте аккаунт голосующего
5. Проголосуйте!

---

## Обновление деплоя

### Через CLI:
```bash
cd frontend
npx vercel --prod
```

### Через GitHub:
Просто сделайте push - Vercel автоматически пересоберёт!

---

## Custom Domain (опционально)

В Vercel Dashboard:
1. Перейдите в ваш проект
2. Settings → Domains
3. Add Domain
4. Следуйте инструкциям DNS

---

## Troubleshooting

### "Build failed"
```bash
# Проверьте локальную сборку
npm run build

# Если есть ошибки, исправьте их и попробуйте снова
```

### "Module not found"
```bash
# Убедитесь что все зависимости установлены
npm install
```

### Wallet не подключается
- Проверьте что Phantom на **Devnet**
- Обновите страницу
- Очистите кэш браузера

---

## Полезные ссылки

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 🎯 [Next.js on Vercel](https://nextjs.org/docs/deployment)
- 💬 [Vercel Support](https://vercel.com/support)

---

**Время деплоя**: ~2-5 минут  
**Стоимость**: Бесплатно (Hobby plan)  
**Лимиты**: 100 GB bandwidth, unlimited requests

**Удачи! 🚀**

