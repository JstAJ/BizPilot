import { motion } from "framer-motion";
import { format } from "date-fns";
import { greetingForNow } from "@/lib/date";
import { useAuth } from "@/hooks/useAuth";

export function GreetingHeader() {
  const { session } = useAuth();
  const name = session?.username ?? "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex items-end justify-between"
    >
      <div>
        <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, dd MMMM yyyy")}</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {greetingForNow()}, <span className="gold-text capitalize">{name}</span>
        </h1>
      </div>
    </motion.div>
  );
}
