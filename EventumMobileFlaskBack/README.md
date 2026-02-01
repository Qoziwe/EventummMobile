Для продакшена для сокетИО - gunicorn --worker-class eventlet -w 1 app:app --bind 0.0.0.0:5000
В приложении используется FireBase для пуш уведомлений