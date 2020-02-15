# Cognitive test cms

## Sign in
Страница авторизации

### Routing
`(url)/auth/sign-in - (POST)` - авторизация

**Отправляется**
```javascript
    {
        email: string,
        password: string,
    }
```
**Приходит в ответ**
```javascript
    ---
```

`(url)/auth/protected` - идентификация юзера

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    {
        logged_in_as: string // E-mail
    }
```

## Results page
Страница с выводом результатов кандидатов.

**(url) - url/api/admin**

### Routing
`(url)/candidates/ - (GET)` - возвращает список кандидатов с результатами (Имя, набранные балы, желаемая позиция, контактные данные - (телефон, email, CV), сегодняшняя дата, время начала теста и его окончания)

```javascript
    {
        candidate_quizzes: {
            finish_time: number, // Время окончания теста
            quiz_name: string, // Название теста
            score: number, // Набранные баллы
            start_time: number, // Время начала теста
        }[],
        cv: string, // Ссылка на cv
        email: string, // E-mail адресс
        full_name: string, // Полное имя кандидата
        phone: string, // Номер телефона кандидата
        position: string // Выбранная позиция
    }[]
```

## Quizzes management
Страница со списком всех тестов и возможностью их редактировать/создавать/удалять.

### Routing
`(url)/quizzes/ - (GET)` - возвращает список тестов (Название теста, описание теста, тип теста, id)

```javascript
    {
      description: string, // Описание теста
      duration: number, // Время выделенное на тест (сейчас в секундах)
      id: string, // id теста
      name: string, // Название теста
      type: string, // Тип теста
    }[]
```

`(url)/quizzes/ - (POST)` - создание нового теста

**Отправляется**
```javascript
    {
        name: string, // Имя теста
        description: string, // Описание теста
        type: string, // Тип теста
        duration: number, // Время теста (в секундах)
    }
```
**Приходит в ответ**
Объект созданного теста с id
```javascript
    {
        id: string, // id теста
        name: string, // Имя теста
        description: string, // Описание теста
        type: string, // Тип теста
        duration: number, // Время теста (в секундах)
    }
```

`(url)/quizzes/{id} - (PUT)` - редактирование теста

**Отправляется**
```javascript
    {
        name: string, // Имя теста
        description: string, // Описание теста
        type: string, // Тип теста
        duration: number, // Время теста (в секундах)
    }
```
**Приходит в ответ**
Объект измененного теста с id
```javascript
    {
        id: string, // id теста
        name: string, // Имя теста
        description: string, // Описание теста
        type: string, // Тип теста
        duration: number, // Время теста (в секундах)
    }
```

`(url)/quizzes/{id} - (DELETE)` - редактирование теста

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    ---
```

## Questions management
Страница со списком всех вопросов к текущему тесту и возможностью их редактировать/создавать/удалять.

### Routing
`(url)/quizzes/{id}/questions - (GET)` - возвращает список вопросов (Контент вопроса, id, баллы за вопрос)

```javascript
    {
        question_content: string, // Контент ыопроса
        question_id: string, // id вопроса
        weight: number // Баллы
    }[]
```

`(url)/quizzes/{id}/questions - (POST)` - создание нового вопроса

**Отправляется**
```javascript
    {
        question_content: string, // Контент ыопроса
        weight: number // Баллы
    }[]
```
**Приходит в ответ**
Массив обьектов созданных вопросов с id
```javascript
    {
        question_content: string, // Контент ыопроса
        question_id: string, // id вопроса
        weight: number // Баллы
    }[]
```

`(url)/quizzes/{id}/questions/{questId} - (PUT)` - редактирование вопроса

**Отправляется**
```javascript
    {
        question_content: string, // Контент ыопроса
        weight: number // Баллы
    }
```
**Приходит в ответ**
Объект измененного вопроса с id
```javascript
    {
        question_content: string, // Контент ыопроса
        question_id: string, // id вопроса
        weight: number // Баллы
    }
```

`(url)/quizzes/{id}/questions/{questId} - (DELETE)` - редактирование вопроса

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    ---
```

## Variants management
Страница со списком всех вариантов ответов к текущему вопросу и возможностью их редактировать/создавать/удалять.

### Routing
`(url)/quizzes/{id}/questions/{questionId}/variants - (GET)` - возвращает список вариантов (Контент варианта, id, верно/не верно)

```javascript
    {
        is_answer: boolean, // Является ли вариант верным
        variant_content: string, // Контент варианта
        variant_id: string, // id варианта
    }[]
```

`(url)/quizzes/{id}/questions/{questionId}/variants - (POST)` - создание нового варианта

**Отправляется**
```javascript
    {
        is_answer: boolean, // Является ли вариант верным
        variant_content: string, // Контент варианта
    }[]
```
**Приходит в ответ**
Массив обьектов созданных вариантов с id
```javascript
    {
        is_answer: boolean, // Является ли вариант верным
        variant_content: string, // Контент варианта
        variant_id: string, // id варианта
    }[]
```

`(url)/quizzes/{id}/questions/{questionId}/variants/{variantId} - (PUT)` - редактирование варианта

**Отправляется**
```javascript
    {
        is_answer: boolean, // Является ли вариант верным
        variant_content: string, // Контент варианта
    }
```
**Приходит в ответ**
Объект измененного варианта с id
```javascript
    {
        is_answer: boolean, // Является ли вариант верным
        variant_content: string, // Контент варианта
        variant_id: string, // id варианта
    }
```

`(url)/quizzes/{id}/questions/{questionId}/variants/{variantId} - (DELETE)` - редактирование варианта ответа

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    ---
```

## Users management
Страница со списком всех юзеров (юзеры админки).

### Routing
`(url)/users/ - (GET)` - получение списка существующих юзеров

```javascript
    {
        id: string, // id юзера
        email: string, // E-mail юзера
    }[]
```

`(url)/users/ - (POST)` - создание нового юзера

**Отправляется**
```javascript
    {
        email: string, // E-mail юзера
        password: string, // Пароль юзера
    }
```
**Приходит в ответ**
Обьект созданного юзера с id
```javascript
    {
        id: string, // id юзера
        email: string, // E-mail юзера
    }
```

`(url)/users/{userId} - (PUT)` - редактирование существующего юзера

**Отправляется**
```javascript
    {
        email: string, // E-mail юзера
        password: string, // Пароль юзера
    }
```
**Приходит в ответ**
Обьект отредактированного юзера с id
```javascript
    {
        id: string, // id юзера
        email: string, // E-mail юзера
    }
```

`(url)/users/{userId} - (DELETE)` - редактирование данных юзера

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    ---
```

## Positions management
Страница со списком всех позиций (для кандидатов)

### Routing
`(url)/positions/ - (GET)` - список позиций

```javascript
    {
        id: string, // id позиции
        name: string, // Название позиции
        quizzes: string[], // Список типов тестов
    }
```

`(url)/positions/ - (POST)` - создание новой позиции

**Отправляется**
```javascript
    {
        name: string, // Название позиции
        quizzes: string[], // Список типов тестов
    }
```
**Приходит в ответ**
Обьект созданной позиции с id
```javascript
    {
        id: string, // id позиции
        name: string, // Название позиции
        quizzes: string[], // Список типов тестов
    }
```

`(url)/positions/{positionId} - (PUT)` - редактирование позиции

**Отправляется**
```javascript
    {
        name: string, // Название позиции
        quizzes: string[], // Список типов тестов
    }
```
**Приходит в ответ**
Обьект измененной позиции с id
```javascript
    {
        id: string, // id позиции
        name: string, // Название позиции
        quizzes: string[], // Список типов тестов
    }
```

`(url)/positions/{positionId} - (DELETE)` - удаление позиции

**Отправляется**
```javascript
    ---
```
**Приходит в ответ**
```javascript
    ---
```

`(url)/quizzes/types - (GET)` - получение списка типов тестов для позиций

```javascript
    string[]
```