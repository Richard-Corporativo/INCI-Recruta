import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        icon: string;
        mode?: string;
        inline?: boolean;
        width?: string | number;
        height?: string | number;
        rotate?: string | number;
        flip?: string;
        style?: React.CSSProperties;
        class?: string;
      }, HTMLElement>;
    }
  }
}
