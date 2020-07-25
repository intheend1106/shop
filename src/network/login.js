import {
  request
} from './request'


export function getLogindata(loginForm) {
  return request({
    method: 'post',
    url: 'login',
    params: {
      loginForm
    }
  })
}