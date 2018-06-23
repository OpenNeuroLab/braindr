# TODO: node:9 fails because of an opencollective error
FROM node:6
RUN mkdir /code
WORKDIR /code

# Run server in docker
CMD ["bash", "/bin/docker-command.bash"]
