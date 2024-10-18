import React, { useState, useEffect } from 'react';
import {
    FaCode,
    FaCloud,
    FaVideo,
    FaBrain,
    FaShieldAlt,
    FaDatabase,
} from 'react-icons/fa';
import Modal from '../../components/common/Modal';

const Skills: React.FC = () => {
    const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile('ontouchstart' in window || window.innerWidth <= 640);
        };
        checkIfMobile();
    }, []);

    const modals = [
        {
            id: 'software-engineering-modal',
            category: 'Software Engineering',
            icon: <FaCode className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">Early Career</h3>
                    <p className="mb-4">
                        My career in software engineering began in the early days of the web. Inspired by my love for video games and anime, I built my first websites using tools like Microsoft FrontPage, Netscape Composer, Lycos, GeoCities, AngelFire, and Tripod as early as 1996. By high school in 2001, I transitioned to Macromedia Dreamweaver, laying the foundation for web development and igniting my passion for coding and systems design.
                    </p>
                    <h3 className="font-semibold mb-2">University of Texas at Austin</h3>
                    <p className="mb-4">
                        At the University of Texas at Austin, I participated in a summer research project with NASA, where I independently developed control systems for a prototype unmanned space exploration vehicle experiment using C/C++. This experience with large-scale problem-solving shaped my systems engineering approach.
                    </p>
                    <h3 className="font-semibold mb-2">Rackspace</h3>
                    <p className="mb-4">
                        At Rackspace, I honed my skills in full-stack web development, building scalable, robust web applications for enterprise clients. I worked across AWS, Azure, and OpenStack environments, integrating container orchestration (Docker, Kubernetes) and automating CI/CD workflows, optimizing deployment times.
                    </p>
                    <h3 className="font-semibold mb-2">Hewlett Packard Enterprise</h3>
                    <p className="mb-4">
                        At HPE, I continued focusing on full-stack web development, building cloud-native applications and automating infrastructure provisioning with ServiceNOW and Terraform. I also worked on Kafka and Spark-powered data integrations, streamlining backend processes for web applications.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I developed web applications integrated with AI/ML models for automating film production tasks and enhancing streaming experiences. My work included real-time user recommendation systems for Disney+ and Hulu using Kafka and Spark, delivering personalized content and significantly improving user engagement.
                    </p>
                    <h3 className="font-semibold mb-2">Crunchyroll</h3>
                    <p className="mb-4">
                        Currently, I specialize in full-stack web development and media engineering at scale. I’ve built media transcoding pipelines and video playback services and am leading efforts to create self-service infrastructure platforms using Backstage, empowering teams to independently manage and deploy services, driving operational efficiency.
                    </p>
                </>
            ),
        },
        {
            id: 'cloud-infrastructure-modal',
            category: 'Cloud Infrastructure',
            icon: <FaCloud className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">U.S. Department of Veterans Affairs</h3>
                    <p className="mb-4">
                        My cloud journey started at the U.S. Department of Veterans Affairs, where I managed a hybrid cloud environment in Azure. I ensured scalability and security for mission-critical systems, building a strong foundation in enterprise cloud integration.
                    </p>
                    <h3 className="font-semibold mb-2">Rackspace</h3>
                    <p className="mb-4">
                        At Rackspace, I expanded my cloud expertise, working with AWS, Azure, and OpenStack. I designed resilient multi-cloud infrastructures, led container orchestration deployments, and streamlined CI/CD pipelines using Jenkins, GitLab, and Travis CI.
                    </p>
                    <h3 className="font-semibold mb-2">Hewlett Packard Enterprise</h3>
                    <p className="mb-4">
                        At HPE, I designed and deployed cloud solutions across AWS, Azure, and GCP, integrating secure networking solutions like DirectConnect and ExpressRoute. I spearheaded Kubernetes deployments and automated provisioning workflows using Terraform and Puppet, enabling clients to scale effortlessly.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I managed cloud infrastructure supporting AI/ML models for media post-processing and video streaming, improving media workflows and content delivery. My work on EKS clusters helped streamline production pipelines, enhancing video streaming performance.
                    </p>
                    <h3 className="font-semibold mb-2">Crunchyroll</h3>
                    <p className="mb-4">
                        Currently, I maintain video streaming services on AWS and lead the development of a global content delivery network (CDN) for smooth playback. I also manage infrastructure automation using Pulumi and Serverless Framework, scaling operations with user demand.
                    </p>
                </>
            ),
        },
        {
            id: 'media-engineering-modal',
            category: 'Media Engineering',
            icon: <FaVideo className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">Rackspace</h3>
                    <p className="mb-4">
                        At Rackspace, I began my media engineering journey, working with clients like the NFL and Live Nation. I gained foundational expertise in video streaming technologies like FFmpeg, HLS, and DASH, laying the groundwork for future media projects.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I played a key role in developing AI/ML models for automating film production workflows, including pixel analysis and visual effects processing using tools like Nuke, Blender, and FFmpeg. I also contributed to AI-driven content recommendations for Disney+ and Hulu, improving user engagement through personalized suggestions.
                    </p>
                    <h3 className="font-semibold mb-2">Crunchyroll</h3>
                    <p className="mb-4">
                        Currently, I build scalable media transcoding pipelines and optimize video playback systems at Crunchyroll, ensuring smooth streaming for millions of users globally. Leveraging FFmpeg, HLS, and DASH, I ensure robust and efficient content delivery at scale.
                    </p>
                </>
            ),
        },
        {
            id: 'machine-learning-modal',
            category: 'Machine Learning',
            icon: <FaBrain className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">Hewlett Packard Enterprise</h3>
                    <p className="mb-4">
                        At HPE, I began working on MLOps pipelines, integrating AWS and Azure services to streamline machine learning workflows.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I collaborated with research teams to develop AI/ML models for automating visual effects and delivering personalized content recommendations for Disney+ and Hulu. I integrated tools like TensorFlow, PyTorch, and FFmpeg into production pipelines, reducing manual post-production time and optimizing content delivery.
                    </p>
                </>
            ),
        },
        {
            id: 'data-engineering-modal',
            category: 'Data Engineering',
            icon: <FaDatabase className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">Hewlett Packard Enterprise</h3>
                    <p className="mb-4">
                        At HPE, I built ETL pipelines using Apache Kafka and Airflow, ensuring scalable data processing across enterprise systems. I also integrated AWS Glue and Azure Synapse to optimize data workflows for machine learning.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I expanded my data engineering expertise, implementing Kafka and Spark to power real-time data processing for personalized content recommendations. This enabled Disney+ and Hulu to handle large-scale data efficiently, ensuring low-latency delivery of content suggestions.
                    </p>
                </>
            ),
        },
        {
            id: 'security-modal',
            category: 'Security',
            icon: <FaShieldAlt className="text-4xl text-info mb-4" />,
            content: (
                <>
                    <h3 className="font-semibold mb-2">CompUSA</h3>
                    <p className="mb-4">
                        As a Systems Administrator at CompUSA, I managed the security of local systems, implementing antivirus solutions and securing networks. This role built my foundational knowledge in system security and user access controls.
                    </p>
                    <h3 className="font-semibold mb-2">U.S. Army</h3>
                    <p className="mb-4">
                        During my time in the U.S. Army, I deployed encryption protocols and managed access controls for high-security military networks. I was responsible for securing sensitive data and implementing intrusion detection systems (IDS), which enhanced the security posture of mission-critical systems.
                    </p>
                    <h3 className="font-semibold mb-2">U.S. Department of Veterans Affairs</h3>
                    <p className="mb-4">
                        At the VA, I secured hybrid cloud environments while ensuring compliance with federal cybersecurity standards. I led vulnerability management efforts and implemented multi-factor authentication (MFA) and role-based access controls (RBAC), enhancing the security of cloud and on-premises systems, protecting highly sensitive medical and governmental data.
                    </p>
                    <h3 className="font-semibold mb-2">Rackspace</h3>
                    <p className="mb-4">
                        At Rackspace, I focused on securing multi-cloud environments for clients in industries with stringent compliance requirements, such as healthcare and finance. I implemented cloud-native security solutions like AWS IAM and Azure AD, ensuring adherence to HIPAA and PCI-DSS standards. My work in vulnerability management, using tools like Snyk and Veracode, improved security posture across client systems.
                    </p>
                    <h3 className="font-semibold mb-2">Hewlett Packard Enterprise</h3>
                    <p className="mb-4">
                        At HPE, I led security initiatives for Kubernetes deployments, implementing RBAC and network policies. My focus on highly regulated industries ensured compliance with frameworks like FedRAMP and NIST 800-53. I also improved secrets management in Terraform/Ansible scripts, using HashiCorp Vault to securely manage sensitive data.
                    </p>
                    <h3 className="font-semibold mb-2">Disney</h3>
                    <p className="mb-4">
                        At Disney, I secured production workflows and video streaming services on AWS, implementing encryption protocols for data storage and delivery. I worked on securing AI/ML models used in media production, ensuring that models were protected with appropriate access controls and API security.
                    </p>
                    <h3 className="font-semibold mb-2">Crunchyroll</h3>
                    <p className="mb-4">
                        Currently, I focus on securing cloud-native video streaming services and internal web applications. I led efforts to shut down dozens of piracy apps within my first month, significantly reducing unauthorized access to our content and protecting our intellectual property.
                    </p>
                </>
            ),
        },
    ];

    const showModal = (index: number) => {
        setCurrentModalIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = () => {
        setCurrentModalIndex((prevIndex) =>
            prevIndex === null ? 0 : (prevIndex + 1) % modals.length
        );
    };

    const handlePrevious = () => {
        setCurrentModalIndex((prevIndex) =>
            prevIndex === null ? modals.length - 1 : (prevIndex - 1 + modals.length) % modals.length
        );
    };

    return (
        <div className="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Skills</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {modals.map((modal, index) => (
                    <div key={modal.id} className="flex flex-col items-center text-center">
                        {modal.icon}
                        <h3 className="font-semibold mb-2">{modal.category}</h3>
                        <button className="btn btn-sm mt-4" onClick={() => showModal(index)}>
                            Learn More
                        </button>
                    </div>
                ))}
            </div>

            {currentModalIndex !== null && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modals[currentModalIndex].category}
                    content={modals[currentModalIndex]?.content}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    totalPages={modals.length}
                    currentPage={currentModalIndex}
                    isMobile={isMobile}
                />
            )}
        </div>
    );
};

export default Skills;