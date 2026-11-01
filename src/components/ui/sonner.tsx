import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "glass-panel !bg-card/90 !text-card-foreground !border-white/10 !shadow-glass !rounded-2xl",
          title: "font-semibold",
          description: "!text-muted-foreground",
          actionButton: "!bg-gold-500 !text-black",
          cancelButton: "!bg-secondary !text-secondary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
