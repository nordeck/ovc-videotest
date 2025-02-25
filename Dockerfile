FROM node:18-alpine as builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# copy app
COPY . ./

ARG REACT_APP_VERSION
ENV REACT_APP_VERSION $REACT_APP_VERSION

ARG REACT_APP_JITSI_FQDN
ENV REACT_APP_JITSI_FQDN $REACT_APP_JITSI_FQDN

ARG REACT_APP_JWT_ENDPOINT_URL
ENV REACT_APP_JWT_ENDPOINT_URL $REACT_APP_JWT_ENDPOINT_URL

ARG REACT_APP_ROOM_PREFIX
ENV REACT_APP_ROOM_PREFIX $REACT_APP_ROOM_PREFIX

ARG REACT_APP_DEBUG_JITSI_JWT
ENV REACT_APP_DEBUG_JITSI_JWT $REACT_APP_DEBUG_JITSI_JWT

ENV NODE_ENV production

RUN npm run build

# --------------------------------------------------------

FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/build /app/build

USER node
EXPOSE 3000

ENV NODE_ENV production

ENTRYPOINT  ["serve", "-s", "build"]




