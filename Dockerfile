FROM node:20-alpine as builder

COPY ./ /var/wemo-homework
WORKDIR /var/wemo-homework

RUN npm install \
  && npm run build

FROM node:20-alpine

LABEL MAINTAINER="HARCHHI c2tnsuzi@gmail.com"

COPY --from=builder /var/wemo-homework/dist /var/wemo-homework/dist/
COPY --from=builder /var/wemo-homework/package.json /var/wemo-homework/
COPY --from=builder /var/wemo-homework/package-lock.json /var/wemo-homework/

WORKDIR /var/wemo-homework


RUN apk update \
  && apk add tzdata \
  && cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime \
  && apk del tzdata

RUN npm i --production \
  && npm cache clean -f

EXPOSE 3000

CMD ["npm", "run", "start:prod"]%