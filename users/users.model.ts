const users = [
  { id: '1', name: "Peter Parker", email: "peter@marvel.com" },
  { id: '2', name: "Bruce Banner", email: "bruce@marvel.com" }
];

export class User {
  static findAll(): Promise<any[]> {
    return Promise.resolve(users); // returns all the users
  }

  static findById(id: string): Promise<any> {
    return new Promise(resolve => {
      const filtered = users.filter(user => user.id === id); //return an specific user based on the id you passed
      let user = undefined;
      if (filtered.length > 0) {
        user = filtered[0];
      }
      resolve(user);
    });
  }
}
