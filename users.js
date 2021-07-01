export class Users {
  static all() {
    return fetch(
      'https://jsonplaceholder.typicode.com/users'
    ).then((response) => response.json())
  }
}
