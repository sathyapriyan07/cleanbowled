import { supabase } from "@/lib/supabase";

export async function upload(file: File, bucket: string) {
  const name = Date.now() + file.name;

  await supabase.storage.from(bucket).upload(name, file);

  const { data } = supabase.storage.from(bucket).getPublicUrl(name);

  return data.publicUrl;
}
