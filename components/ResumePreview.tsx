import React, { useState, useEffect } from 'react';
import { ApplicantData } from '../types';
import { UserIcon, DocumentIcon } from './icons';

interface ResumePreviewProps {
    data: Partial<ApplicantData>;
    theme: 'light' | 'bold';
}

interface AnimatedSectionProps {
    children: React.ReactNode;
    show: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, show }) => {
    return (
        <div
            className={`transition-all duration-500 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            {children}
        </div>
    )
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme }) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (data.photo && data.photo instanceof File) {
            const url = URL.createObjectURL(data.photo);
            setPhotoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.photo]);

    const cardBgColor = theme === 'bold' ? 'bg-slate-800' : 'bg-white';
    const textColor = theme === 'bold' ? 'text-slate-300' : 'text-slate-600';
    const headingColor = theme === 'bold' ? 'text-white' : 'text-slate-900';
    const accentColor = 'text-primary';
    const headingStyle = `text-xl font-bold ${headingColor} border-b-2 border-primary/30 pb-2 mb-4`;

    return (
        <div className={`p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto ${cardBgColor} transition-colors duration-300`}>
            <div className="flex flex-col items-center text-center">
                <AnimatedSection show={true}>
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mb-4 overflow-hidden ring-4 ring-primary/20">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Applicant" className="w-full h-full object-cover" />
                        ) : (
                            <img src="image.png" alt="Applicant" className="w-full h-full object-cover" />
                            // <UserIcon className="w-16 h-16 text-gray-400 dark:text-slate-500" />
                        )}
                    </div>
                </AnimatedSection>

                <AnimatedSection show={!!data.fullName}>
                    <h1 className={`text-3xl font-bold ${headingColor}`}>{data.fullName || 'Jane Doe'}</h1>
                </AnimatedSection>

                <AnimatedSection show={!!data.email || !!data.phone}>
                    <p className={`mt-2 ${textColor}`}>
                        {data.email || 'your@email.com'} &bull; {data.phone || '(555) 123-4567'}
                    </p>
                </AnimatedSection>

                <AnimatedSection show={!!data.portfolio}>
                    <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className={`mt-2 ${accentColor} hover:underline break-all`}>
                        {data.portfolio}
                    </a>
                </AnimatedSection>
            </div>

            <div className="mt-10 text-left space-y-8">
                <AnimatedSection show={!!data.bio}>
                    <div>
                        <h2 className={headingStyle}>About Me</h2>
                        <p className={`${textColor} whitespace-pre-wrap text-sm`}>
                            {data.bio || 'A brief summary about your professional background will appear here.'}
                        </p>
                    </div>
                </AnimatedSection>
                {data.applicantType === 'Experienced' && (
                    <AnimatedSection show={data.applicantType === 'Experienced' && !!data.noticePeriod}>
                        <div>
                            <h2 className={headingStyle}>Experience Details</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                                <p className={textColor}>Notice Period:</p><p className={headingColor}>{data.noticePeriod}</p>
                                <p className={textColor}>Current CTC:</p><p className={headingColor}>{data.currentCTC}</p>
                                <p className={textColor}>Expected CTC:</p><p className={headingColor}>{data.expectedCTC}</p>
                            </div>
                        </div>
                    </AnimatedSection>
                )}

                {data.applicantType === 'Fresher' && (
                    <AnimatedSection show={data.applicantType === 'Fresher' && !!data.learningInterests}>
                        <div>
                            <h2 className={headingStyle}>Academics & Interests</h2>
                            <div className="space-y-2 mt-2 text-sm">
                                <div>
                                    <p className={`${textColor} font-semibold`}>Learning Interests:</p>
                                    <p className={`${headingColor} whitespace-pre-wrap`}>{data.learningInterests}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div><p className={textColor}>Graduation:</p><p className={headingColor}>{data.graduationYear}</p></div>
                                    <div><p className={textColor}>AI Knowledge:</p><p className={headingColor}>{data.aiKnowledge}</p></div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                )}

                <AnimatedSection show={!!data.city}>
                    <div>
                        <h2 className={headingStyle}>Location</h2>
                        <p className={`${headingColor} text-sm`}>{data.city}</p>
                    </div>
                </AnimatedSection>

                <AnimatedSection show={!!data.resume}>
                    <div>
                        <h2 className={headingStyle}>Documents</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                            <DocumentIcon className={`w-5 h-5 ${textColor}`} />
                            <p className={headingColor}>{data.resume?.name}</p>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default ResumePreview;