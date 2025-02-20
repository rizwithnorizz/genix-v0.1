import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

export default function ApplicationLogo({ src, ...props }: ApplicationLogoProps) {
    return (
        <img
            {...props}
            src={src}
            alt="Application Logo"
        />
    );
}
