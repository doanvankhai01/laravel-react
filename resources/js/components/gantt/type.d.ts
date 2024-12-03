import 'react';

declare module 'react' {
  export interface CSSProperties extends CustomProp {
    '--left'?: string;
    '--right'?: string;
  }
}
