import { User } from "../providers/ArrtistryProvider"

export const getAccounts = (user?: User): string[] => {
  return user.accounts || []
}
