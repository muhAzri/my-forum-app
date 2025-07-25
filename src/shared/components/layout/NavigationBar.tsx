import { Link } from 'react-router-dom';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu';

interface NavigationItem {
  to: string;
  label: string;
}

interface NavigationBarProps {
  items: NavigationItem[];
}

export function NavigationBar({ items }: NavigationBarProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.to}>
            <NavigationMenuLink asChild>
              <Link
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                to={item.to}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
