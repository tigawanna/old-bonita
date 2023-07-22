import { z } from 'zod'
const AddArgsSchema = z.object({
    inputs: z.array(z.string()),
    options:z.any().optional()
});
type AddArgs = z.infer<typeof AddArgsSchema>; 
export async function parse_add_args({inputs}:AddArgs) {
 try {
    
 } catch (error) {
    throw error
 }   
}
