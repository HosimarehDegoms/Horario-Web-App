export interface Profile {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface SignUpInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignUpResult {
  /** False when the project requires email confirmation — no session exists yet. */
  session: boolean
}
