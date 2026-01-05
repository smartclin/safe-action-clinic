import { CheckCircle, Database, FileText, Lock, Shield, Users } from 'lucide-react';

export const hipaaFeatures = [
    {
        icon: Shield,
        title: 'End-to-End Encryption',
        description: 'All data transmitted and stored is encrypted using AES-256 encryption standards'
    },
    {
        icon: Lock,
        title: 'Access Controls',
        description: 'Role-based access controls ensure only authorized personnel can access patient data'
    },
    {
        icon: CheckCircle,
        title: 'Audit Logging',
        description: 'Comprehensive audit trails track all access and modifications to patient records'
    },
    {
        icon: FileText,
        title: 'Business Associate Agreement',
        description: 'We provide a BAA that outlines our responsibilities as a business associate'
    },
    {
        icon: Users,
        title: 'Employee Training',
        description: 'All employees undergo HIPAA compliance training and sign confidentiality agreements'
    },
    {
        icon: Database,
        title: 'Secure Infrastructure',
        description: 'Hosted on HIPAA-compliant infrastructure with regular security assessments'
    }
];

export const hipaaRequirements = [
    'Administrative Safeguards',
    'Physical Safeguards',
    'Technical Safeguards',
    'Organizational Requirements',
    'Policies and Procedures',
    'Breach Notification'
];
