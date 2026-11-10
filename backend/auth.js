import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnonKey || !supabaseUrl) {
    throw new Error ("Dumrian");
};

export async function requireAuth (req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(404).json({
                error: "Authorization did not work"
            })
        }
        const token = authHeader.split(" ")[1]
        if (!token){
            // something
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user ) {
            // Do error
        }

        req.userId = user.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: "Authentication did not work :-("});
    }
};