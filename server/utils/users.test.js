const expect = require("expect");

const { Users } = require("./user");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "The office fanse"
      },
      {
        id: "2",
        name: "Sam",
        room: "Scrubs fan"
      },
      {
        id: "3",
        name: "Jose",
        room: "The office fanse"
      }
    ];
  });

  it("should add new user", () => {
    let users = new Users();
    let user = {
      id: "sdfdsgsg",
      name: "WDJ",
      room: "The office fanse",
    };
    let reUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should return names for the office fans', () => {
      let userList = users.getUserList('The office fanse');

      expect(userList).toEqual(['Mike','Jose']);

  })

  it('should return names for the Scrubs fan', () => {
    let userList = users.getUserList('Scrubs fan');

    expect(userList).toEqual(['Sam']);
  })

  it('should find user', () => {
    let userID = '2', 
        user = users.getUser(userID);
    
    expect(user.id).toBe(userID);
  });


  it('should not find user', () => {
    let userID = '150', 
        user = users.getUser(userID);
    
    expect(user).toBeUndefined();
  });

  it('should not remove a user', () => {
    let userID = '130', 
        user = users.removeUser(userID);
    expect(user).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should remove a user', () => {
    let userID = '1', 
        user = users.removeUser(userID);
    expect(user.id).toBe(userID);
    expect(users.users.length).toBe(2);
  });
});
