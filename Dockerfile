FROM node:14.5.0-alpine

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN apk add --update python make g++\
	&& rm -rf /var/cache/apk/*

RUN yarn

# Bundle app source
COPY . /usr/src/app

RUN yarn build
EXPOSE 3000

CMD [ "yarn", "start" ]
