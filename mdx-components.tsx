import Image, { ImageProps } from 'next/image';

import type { MDXComponents } from 'mdx/types';

export function MdxImage(props: ImageProps) {
  return (
    <Image
      style={{
        width: 'auto',
        height: 'auto',
      }}
      width={800}
      height={600}
      {...props}
      alt={props.alt}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        alt={props.alt || ''}
        className="rounded-lg"
        width={640}
        height={480}
        {...(props as Omit<ImageProps, 'alt'>)}
      />
    ),
    MdxImage,
    ...components,
  };
  // Allows customizing built-in components, e.g. to add styling.
  // return {
  //   h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
  //   ...components,
  // }
}
