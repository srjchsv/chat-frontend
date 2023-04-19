#!/bin/bash

if [[ $1 == "dev" ]]; then
    # Run the app
   npm run dev

elif [[ $1 == "container" ]]; then
    #  Run conteinerized app
    docker run -p 3000:3000 chat-frontend

elif [[ $1 == "build" ]]; then
    # Build container
    docker build -t chat-frontend .

else
    echo "Invalid argument. Please specify either 'dev', 'build' or 'container'"
fi

