import { Box, Button } from "@mui/material"
import { updateUserSchema, type UpdateUserInput } from "../../../utils/validations/updateUserSchema"
import { useEffect } from "react"
import { useFetchUser, useUpdateUser } from "../../../hooks/useUser"
import { useForm } from "react-hook-form"
import { useSnackbar } from "../../../context/SnackBarContext"
import { zodResolver } from "@hookform/resolvers/zod"
import UpdateUserInformation from "./components/UpdateUserInformation"

export type UpdateUserFormProps = {
  cancel: () => void;
  isOpen: boolean;
  userId?: string;
}

const UpdateUserForm = (props: UpdateUserFormProps) => {

  const { cancel, isOpen, userId } = props
  const { mutateAsync, isPending } = useUpdateUser()
  const { data: user, isPending: isLoading, isError } = useFetchUser(userId ?? "");
  const { showSnackbar } = useSnackbar();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      user_role: "",
      first_name: "",
      last_name: "",
      user_status: 0
    }
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if(!isOpen) {
      reset()
    }
  },[isOpen])

  useEffect(() => {
    if(!user) return
    reset({
      username: user?.user_credentials?.username,
      email: user?.email,
      user_role: user?.user_role,
      first_name: user?.first_name,
      last_name: user?.last_name,
      user_status: user?.user_status
    })
  }, [user, reset])

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await mutateAsync({ userId: userId ?? "", user: data })
      showSnackbar("User updated successfully", "success")
    } catch (error) {
      console.error("Error updating user:", error)
      showSnackbar("Failed to update user", "error")
    } finally {
      form.reset()
      cancel()
    }
  }

  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UpdateUserInformation form={form} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel} disabled={isPending}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit" disabled={isPending}>{isPending ? "Updating..." : "Update User"}</Button>
      </Box>
    </form>
  )
}

export default UpdateUserForm