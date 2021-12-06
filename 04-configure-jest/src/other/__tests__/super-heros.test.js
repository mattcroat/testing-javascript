import { getFlyingSuperHeros } from '../super-heros'

test('returns super heros that can fly', () => {
  let flyingHeros = getFlyingSuperHeros()
  //   expect(flyingHeros).toMatchInlineSnapshot(`
  // Array [
  //   Object {
  //     "name": "Dynaguy",
  //     "powers": Array [
  //       "disintegration ray",
  //       "fly",
  //     ],
  //   },
  //   Object {
  //     "name": "Apogee",
  //     "powers": Array [
  //       "gravity control",
  //       "fly",
  //     ],
  //   },
  //   Object {
  //     "name": "Jack-Jack",
  //     "powers": Array [
  //       "shapeshifting",
  //       "fly",
  //     ],
  //   },
  // ]
  // `)
})
