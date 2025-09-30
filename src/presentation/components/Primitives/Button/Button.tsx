"use client";

import { cn } from "@/utils";
import { IconProps } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { LinkProps as NextLinkProps } from "next/link";
import React, { JSX } from "react";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-colors disabled:pointer-events-none shrink-0 outline-none",
    "aria-invalid:border-secondary-red border-content disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-grey-900 border border-transparent text-white hover:bg-grey-500 p-4 txt-preset-4-bold",
        secondary:
          "bg-beige-100 text-grey-900 border border-transparent hover:border-beige-500 hover:bg-transparent p-4 txt-preset-4-bold",
        tertiary: "txt-preset-4 text-grey-500 hover:text-grey-900",
        destructive:
          "bg-secondary-red border border-transparent text-white hover:bg-secondary-red/80 p-4 txt-preset-4-bold",
        link: "txt-preset-4-bold text-grey-900 hover:text-grey-500 underline [&_svg]:hidden",
        "link-small":
          "txt-preset-5 underline text-grey-900 hover:text-grey-500 [&_svg]:hidden",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & Partial<IconProps>
>;

type IconConfig = {
  component: IconComponent;
  size?: "default" | "sm";
  weight?: IconProps["weight"];
  className?: string;
  loc?: "left" | "right";
};

type IconProp = IconConfig | undefined;

type ButtonOwnProps = {
  icon?: IconProp;
  label: string;
  iconOnly?: boolean;
  className?: string;
  disabled?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
} & VariantProps<typeof buttonVariants>;

type LinkVariant = ButtonOwnProps &
  Omit<NextLinkProps, "href" | "ref" | "children"> & {
    href: string;
  };

type ButtonVariant = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: undefined;
  };

type Props = LinkVariant | ButtonVariant;

export const Button: {
  (props: LinkVariant): JSX.Element;
  (props: ButtonVariant): JSX.Element;
} = ({
  href,
  icon,
  label,
  iconOnly = false,
  className,
  variant = "primary",
  disabled,
  target,
  rel,
  ...rest
}: Props): JSX.Element => {
  if (iconOnly && !icon) {
    // eslint-disable-next-line no-console
    console.warn(
      "Button: `iconOnly` is true but no `icon` was provided. Provide an icon for icon-only buttons."
    );
  }

  const baseClass = cn(buttonVariants({ variant }), className);

  const normalizedIcon: IconConfig | undefined =
    icon == null
      ? undefined
      : typeof icon === "function"
        ? {
            component: icon as IconComponent,
          }
        : icon;

  const Icon = normalizedIcon?.component;
  const sizeClass = normalizedIcon?.size === "sm" ? "size-3" : "size-5";
  const composedIconClass = cn(
    sizeClass,
    normalizedIcon?.className,
    "pointer-events-none shrink-0"
  );

  const renderContent = () => (
    <>
      {Icon && (normalizedIcon?.loc ?? "left") === "left" && (
        <Icon
          weight={normalizedIcon?.weight}
          className={composedIconClass}
          focusable={false}
          aria-hidden
        />
      )}

      <span className={iconOnly ? "sr-only" : undefined}>{label}</span>

      {Icon && (normalizedIcon?.loc ?? "left") === "right" && (
        <Icon
          weight={normalizedIcon?.weight}
          className={composedIconClass}
          focusable={false}
          aria-hidden
        />
      )}
    </>
  );

  if (typeof href === "string" && href.length > 0) {
    const linkRest = rest as Omit<NextLinkProps, "href">;

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> | undefined =
      disabled
        ? (e) => {
            e.preventDefault();
            e.stopPropagation();
          }
        : undefined;

    const safeRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;

    return (
      <Link
        href={href}
        className={baseClass}
        onClick={handleClick}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        target={target}
        rel={safeRel}
        {...(linkRest as Omit<NextLinkProps, "href">)}
      >
        {renderContent()}
      </Link>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const typeProp = buttonRest.type ? {} : ({ type: "button" } as const);

  return (
    <button
      data-slot="button"
      className={baseClass}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      {...typeProp}
      {...buttonRest}
      suppressHydrationWarning
    >
      {renderContent()}
    </button>
  );
};

export default Button;
