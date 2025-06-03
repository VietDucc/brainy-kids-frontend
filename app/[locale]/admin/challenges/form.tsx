// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "@/components/ui/use-toast"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { MultipleChoiceForm } from "@/components/admin/challenge-types/multiple-choice-form"
// import { MatchingForm } from "@/components/admin/challenge-types/matching-form"
// import { FillInBlanksForm } from "@/components/admin/challenge-types/fill-in-blanks-form"

// const formSchema = z.object({
//   title: z.string().min(2, {
//     message: "Title must be at least 2 characters.",
//   }),
//   instructions: z.string().min(10, {
//     message: "Instructions must be at least 10 characters.",
//   }),
//   type: z.string({
//     required_error: "Please select a challenge type.",
//   }),
//   lessonId: z.string({
//     required_error: "Please select a lesson.",
//   }),
//   status: z.string({
//     required_error: "Please select a status.",
//   }),
// })

// // Mock data for lessons
// const lessons = [
//   { id: "1", title: "Saying Hello", unitTitle: "Greetings and Introductions" },
//   { id: "2", title: "Introducing Yourself", unitTitle: "Greetings and Introductions" },
//   { id: "3", title: "Asking Names", unitTitle: "Greetings and Introductions" },
//   { id: "4", title: "Saying Goodbye", unitTitle: "Greetings and Introductions" },
//   { id: "5", title: "Polite Expressions", unitTitle: "Greetings and Introductions" },
// ]

// export function ChallengeForm({ challenge }: { challenge?: any }) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [challengeType, setChallengeType] = useState(challenge?.type || "multiple-choice")

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: challenge?.title || "",
//       instructions: challenge?.instructions || "",
//       type: challenge?.type || "multiple-choice",
//       lessonId: challenge?.lessonId || "",
//       status: challenge?.status || "draft",
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true)

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false)
//       toast({
//         title: "Challenge saved",
//         description: "Your challenge has been saved successfully.",
//       })
//       router.push("/admin/challenges")
//     }, 1000)

//     console.log(values)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter challenge title" {...field} />
//                 </FormControl>
//                 <FormDescription>This is the title of your challenge.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Challenge Type</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     setChallengeType(value)
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a challenge type" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
//                     <SelectItem value="matching">Matching</SelectItem>
//                     <SelectItem value="fill-in-blanks">Fill in the Blanks</SelectItem>
//                     <SelectItem value="speaking">Speaking</SelectItem>
//                     <SelectItem value="listening">Listening</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>The type of challenge you want to create.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="instructions"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Instructions</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Enter challenge instructions" className="min-h-20" {...field} />
//               </FormControl>
//               <FormDescription>Provide clear instructions for the challenge.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="lessonId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Lesson</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a lesson" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {lessons.map((lesson) => (
//                       <SelectItem key={lesson.id} value={lesson.id}>
//                         {lesson.title} ({lesson.unitTitle})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>The lesson this challenge belongs to.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="published">Published</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>Set the visibility status of your challenge.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Card>
//           <CardContent className="pt-6">
//             <Tabs value={challengeType} onValueChange={setChallengeType}>
//               <TabsList className="grid w-full grid-cols-3 mb-6">
//                 <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
//                 <TabsTrigger value="matching">Matching</TabsTrigger>
//                 <TabsTrigger value="fill-in-blanks">Fill in the Blanks</TabsTrigger>
//               </TabsList>
//               <TabsContent value="multiple-choice">
//                 <MultipleChoiceForm />
//               </TabsContent>
//               <TabsContent value="matching">
//                 <MatchingForm />
//               </TabsContent>
//               <TabsContent value="fill-in-blanks">
//                 <FillInBlanksForm />
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>

//         <div className="flex gap-2">
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? "Saving..." : "Save Challenge"}
//           </Button>
//           <Button type="button" variant="outline" onClick={() => router.push("/admin/challenges")}>
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
