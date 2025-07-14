import {z} from "zod"

export const userRegisterSchema=z.object({
    fullname:z.string().min(3,"fullname atleast 3 chars long").max(20,"max 20 chars long"),
    username:z.string().min(8),
    email:z.email("invalid email format").toLowerCase(),
    password:z.string().min(8)
})