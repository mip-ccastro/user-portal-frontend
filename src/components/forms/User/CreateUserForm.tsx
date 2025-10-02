import { useForm } from "react-hook-form"
import { createUserSchema, type CreateUserInput } from "../../../utils/validations/createUserSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateUserInformation from "./components/CreateUserInformation"
import { Box, Button } from "@mui/material"
import { useEffect } from "react"
import { useCreateUser } from "../../../hooks/useUser"
import { useSnackbar } from "../../../context/SnackBarContext"

export type CreateUserFormProps = {
  cancel: () => void;
  isOpen: boolean;
}

const CreateUserForm = (props: CreateUserFormProps) => {

  const { cancel, isOpen } = props
  const { mutateAsync, isPending } = useCreateUser()
  const { showSnackbar } = useSnackbar();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      user_role: "",
      first_name: "",
      last_name: "",
      password: ""
    }
  })

  const { handleSubmit } = form

  useEffect(() => {
    if(!isOpen) {
      form.reset()
    }
  },[isOpen])

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await mutateAsync(data)
      showSnackbar("User created successfully", "success")
    } catch (error) {
      console.error("Error creating user:", error)
      showSnackbar("Failed to create user", "error")
    } finally {
      form.reset()
      cancel()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CreateUserInformation form={form} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel} disabled={isPending}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create User"}</Button>
      </Box>
    </form>
  )
}

export default CreateUserForm