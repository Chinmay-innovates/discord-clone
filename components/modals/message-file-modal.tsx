'use client'
import axios from "axios"
import * as z from "zod"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"


import { zodResolver } from "@hookform/resolvers/zod"
import { useModal } from "@/hooks/use-modal-store"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"

const formSchema = z.object({
    fileUrl: z.string().min(1, { message: "Attachment is required." })
})

export const MessageFileModal = () => {

    const router = useRouter();
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    });
    const handleClose = () => {
        form.reset();
        onClose()
    }

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });
            form.reset();
            router.refresh();
            handleClose();

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a mesage
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-x-8 px-6 ">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint='messageFile'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}

                                />
                            </div>

                        </div>
                        <DialogFooter className="bg-gray-400 px-6 py-4">
                            <Button disabled={isLoading} variant='primary'>Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}