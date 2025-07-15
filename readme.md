# Project Management System (Мини-версия)

> Моя клиент часть легковесной системы управления проектами с канбан-досками и списком задач
![Project Demo GIF](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNrbGtmOTNiN201Mmd2ZnlqN2t6cWQyM2Fvc2E4aHp4ZGlwZnNhYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OGuEKEUUGkIVeoqMTk/giphy.gif)

 ## Ключевые возможности

* **Просмотр проектов:** Отображение списка всех досок (проектов) с указанием количества задач.
* **Канбан-доска:** Визуализация задач на доске с колонками "Backlog", "In Progress", "Done".
* **Drag-and-Drop:** Интуитивное перемещение задач между колонками для смены их статуса.
* **Управление задачами:** Создание и редактирование задач через модальное окно.
* **Общий список задач:** Просмотр всех задач из всех проектов в виде таблицы с возможностью сортировки и фильтрации.
* **Фильтрация:** Мощные фильтры по названию, статусу, проекту (доске) и исполнителю.
* **Навигация:** Удобный переход со страницы всех задач на конкретную доску. 
 
 

>![Project Demo GIF](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjlsdWkwb3ZoYmgwdXJveW4zN3RuYXBjamlucGh4ZnFkaGJicTB3bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2OvbKibZy9eUITX6bu/giphy.gif)


## Стек технологий


<summary><strong>Frontend (Client)</strong></summary>

| Технология | Назначение |
| :--- | :--- |
| **React** | Основная библиотека для построения UI |
| **TypeScript** | Типизация для надежности кода |
| **Redux Toolkit** | Управление состоянием приложения |
| **Ant Design** | Комплексная UI-библиотека компонентов |
| **Vite** | Сборщик проекта и dev-сервер |
| **Axios** | HTTP-клиент для взаимодействия с API |
| **React Router** | Навигация и маршрутизация |
| **Vitest & RTL**| Написание unit и интеграционных тестов |
| **ESLint & Prettier** | Линтинг и форматирование кода |

<summary><strong>DevOps</strong></summary>

| Технология | Назначение |
| :--- | :--- |
| **Docker** | Контейнеризация приложения |
| **Docker Compose** | Оркестрация контейнеров для разработки |

## Запуск проекта

Проект полностью готов к запуску через Docker.

1.  **Клонируйте репозиторий:**

    ```bash
    git clone https://github.com/Mx-Tr/project-management-system
    cd project-management-system
    ```

2.  **Запустите Docker Compose:**

    ```bash
    docker-compose up --build
    ```

3.  **Откройте приложение в браузере:**
    * **Клиент:** [http://localhost:3000](http://localhost:3000)
    * **Сервер (API):** [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
    * **Документация API (Swagger):** [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)
