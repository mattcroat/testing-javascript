import axios from 'axios'
import { Users } from './users'

jest.mock('axios')

test('should fetch users', () => {
  const users = [{ name: 'Jest' }]
  const response = { data: users }
  axios.get.mockResolvedValue(response)

  return Users.all().then((data) => expect(data).toEqual(users))
})
