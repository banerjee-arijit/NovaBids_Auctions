import { Link } from "react-router-dom";

export default function NavListItem({ title, children, to, href }) {
  const Component = to ? Link : "a";
  const props = to
    ? { to }
    : { href, target: "_blank", rel: "noopener noreferrer" };

  return (
    <li>
      <Component
        {...props}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="text-sm text-muted-foreground">{children}</p>
      </Component>
    </li>
  );
}
