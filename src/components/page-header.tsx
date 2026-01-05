interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode; // <- Add this
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
                <h1 className='font-bold text-2xl'>{title}</h1>
                {description && <p className='text-muted-foreground'>{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
