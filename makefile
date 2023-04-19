build:
	docker build -t chat-frontend .
run:
	docker run -p 3000:3000 chat-frontend