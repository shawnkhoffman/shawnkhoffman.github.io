<template>
  <div class="w-full max-w-5xl mb-10 p-6 bg-base-100 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold mb-6 text-center">Skills</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      <div v-for="(modal, index) in modals" :key="modal.id" class="flex flex-col items-center text-center">
        <Icon :icon="modal.iconName" class="text-4xl text-info mb-4" aria-hidden="true" />
        <h3 class="font-semibold mb-2">{{ modal.category }}</h3>
        <button class="btn btn-sm mt-4" @click="() => showModal(index)">
          Learn More
        </button>
      </div>
    </div>

    <Modal v-if="currentModalIndex !== null" :is-open="isModalOpen" :on-close="closeModal"
      :title="modals[currentModalIndex].category" :on-next="handleNext" :on-previous="handlePrevious"
      :total-pages="modals.length" :current-page="currentModalIndex" :is-expanded="isModalExpanded"
      :on-toggle-expand="toggleModalExpand" :trigger-overflow-check="triggerOverflowCheck">
      <template #default>
        <div v-html="modals[currentModalIndex].content"></div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Modal from '@/components/common/Modal.vue';

interface ModalData {
  id: string;
  category: string;
  iconName: string;
  content: string;
}

const currentModalIndex = ref<number | null>(null);
const isModalOpen = ref(false);
const isModalExpanded = ref(true);
const triggerOverflowCheck = ref(0);

const modals: ModalData[] = [
  {
    id: 'software-engineering-modal',
    category: 'Software Engineering',
    iconName: 'fa6-solid:code',
    content: `
      <p class="leading-relaxed mb-6">
        My journey in software engineering started well before it became my profession. Back in the early days of the web, I was inspired by my love for video games and anime, which led me to build my first websites. In 1996, I was using tools like Microsoft FrontPage, Netscape Composer, GeoCities, and Tripod to experiment with web development. By high school in 2002, I had upgraded to Macromedia Dreamweaver, which really solidified my interest in coding and systems design. It wasn't just a hobby anymore – it was something I knew I wanted to do long-term.
      </p>
      <p class="leading-relaxed mb-6">
        Over the years, my career has evolved into full-stack development across different industries, always with a focus on creating systems that are scalable, maintainable, and high-performance. I'm a big advocate of domain-driven design (DDD), which helps me align technical implementations with the real needs of the business. This approach lets me build around specific business logic, encapsulating it within bounded contexts to keep everything clean and organized.
      </p>
      <h4 class="font-bold text-lg mb-3">Frontend Development</h4>
      <p class="leading-relaxed mb-6">
        When it comes to frontend development, I prefer Vue because it allows me to build reusable, composable components that simplify development, especially in larger applications. For bundling, I like Vite for its fast Hot Module Replacement (HMR) and simple setup, which is particularly useful in TypeScript projects where real-time feedback is critical.
      </p>
      <p class="leading-relaxed mb-6">
        For styling, I often combine Tailwind CSS with DaisyUI. Tailwind's utility-first approach lets me quickly prototype UI elements without diving into custom CSS, while DaisyUI provides accessible, pre-styled components that ensure a consistent look and feel across the application.
      </p>
      <p class="leading-relaxed mb-6">
        Accessibility is a priority for me because it's simply a non-negotiable part of modern web design. I make sure every interface works seamlessly across devices and assistive technologies by implementing ARIA roles, keyboard navigation, and screen reader support. I also bake in internationalization (i18n) from the start, using tools like i18next to make localization easy for global users.
      </p>
      <p class="leading-relaxed mb-6">
        For testing, I go with Vitest for unit and integration tests, especially given its fast performance and native integration with Vite. I also use Vue Test Utils to verify that my components behave as expected. On top of that, DataDog RUM and Google Analytics help me track real user interactions, which I use to continuously improve both the user experience and performance.
      </p>
      <h4 class="font-bold text-lg mb-3">Backend Development</h4>
      <p class="leading-relaxed mb-6">
        On the backend, I focus on building scalable microservices using the right language and framework for the job. Often, I work in TypeScript because many of my projects integrate closely with frontend services, and TypeScript's strict type safety helps minimize runtime errors while keeping development fast and maintainable.
      </p>
      <p class="leading-relaxed mb-6">
        For high-performance systems – whether it's a gRPC or REST API, media transcoding pipeline, or a real-time application – I'll opt for Go. It handles concurrency really well and performs efficiently under heavy loads. If I'm dealing with more flexible workflows, like data pipelines or machine learning tasks, I lean toward Python because its vast ecosystem and tools like Apache Airflow and Spark make it easy to work with large datasets or complex processes.
      </p>
      <p class="leading-relaxed mb-6">
        Data handling is something I take seriously, and I use both SQL and NoSQL databases depending on the project. I tend to choose PostgreSQL or DynamoDB based on the data model and use Redis for caching. I often integrate with messaging systems like SQS or Kafka for handling async workflows.
      </p>
      <p class="leading-relaxed mb-6">
        I like to follow clean architecture principles, focusing on modularity and separation of concerns. This ensures that the codebase stays maintainable and flexible as new features or requirements come up. To monitor everything, I use DataDog and Prometheus for real-time insights into service performance, capturing key metrics like response times, memory usage, and error rates. This helps me spot bottlenecks early and optimize proactively.
      </p>
      <h4 class="font-bold text-lg mb-3">DevOps</h4>
      <p class="leading-relaxed mb-6">
        I've been working with various version control and CI/CD platforms since 2016, and GitHub and GitLab have become my preferred tools for managing code and automating workflows. I build CI/CD pipelines that cover everything—from linting and testing to deployment and monitoring. I also integrate security scanning tools like Snyk and Veracode to identify vulnerabilities early on.
      </p>
      <p class="leading-relaxed mb-6">
        For release automation, I use Semantic Release with Conventional Commits to ensure that versioning is consistent and releases are automated without any hiccups.
      </p>
      <p class="leading-relaxed mb-6">
        Containerization is a big part of my workflow. I use Docker for local development, especially with LocalStack when building AWS-based services. In production, Kubernetes is my go-to for orchestration, particularly when paired with ArgoCD, Argo Rollouts, Helm, and Istio.
      </p>
      <p class="leading-relaxed mb-6">
        I place a strong emphasis on observability. DataDog is my preferred tool for centralized logs, metrics, and traces because it gives me real-time insights into how systems are performing and how users are interacting with services. DataDog's dashboards and alerting capabilities make it easy to track key metrics and quickly resolve any issues before they impact users. I also integrate OpsGenie or PagerDuty for incident management, making sure that issues are addressed efficiently.
      </p>
    `,
  },
  {
    id: 'cloud-infrastructure-modal',
    category: 'Cloud Infrastructure',
    iconName: 'fa6-solid:cloud',
    content: `
      <p class="leading-relaxed mb-6">
        My experience with cloud infrastructure has evolved from managing complex hybrid systems to designing multi-cloud solutions for large-scale production workloads. I've spent a lot of time working with AWS, Azure, and GCP, always looking for ways to leverage cloud-native services to improve scalability, security, and cost efficiency.
      </p>
      <h4 class="font-bold text-lg mb-3">Infrastructure as Code (IaC)</h4>
      <p class="leading-relaxed mb-6">
        Using tools like Pulumi, Terraform, and Serverless Framework, my preferred approach to IaC emphasizes using pre-built modules from within the service repository — this way, the infrastructure can scale quickly while still maintaining high security and performance standards. The goal is to ensure the infrastructure can evolve alongside the application and business requirements without introducing complexity or risk.
      </p>
      <h4 class="font-bold text-lg mb-3">Cloud Infrastructure Monitoring</h4>
      <p class="leading-relaxed mb-6">
        I prefer DataDog and cloud-native solutions to track infrastructure performance and reliability. With DataDog, custom dashboards and alerts help me keep an eye on key metrics like resource utilization, latency, and network traffic so I can detect and fix issues proactively before they turn into bigger problems, which is critical for minimizing downtime. I also tie these monitoring tools into automated incident response workflows with OpsGenie or PagerDuty to make sure any issues are handled quickly and efficiently.
      </p>
      <h4 class="font-bold text-lg mb-3">Networking</h4>
      <p class="leading-relaxed mb-6">
        I've worked a lot with VPC architectures to ensure secure and efficient connectivity between services. This has included setting up secure networking solutions like DirectConnect, VPNs, and fine-tuning IAM roles to make sure resources are both secure and accessible only to authorized users. I also make sure that network traffic and security events are continuously monitored, so any threats can be detected and responded to before they become an issue.
      </p>
    `,
  },
  {
    id: 'media-engineering-modal',
    category: 'Media Engineering',
    iconName: 'fa6-solid:video',
    content: `
      <p class="leading-relaxed mb-6">
        Media engineering has been a core part of my work, especially with platforms like Disney+ and Crunchyroll. My focus has been on building and optimizing media transcoding, delivery, and playback to ensure video content is processed and delivered efficiently, no matter the device.
      </p>
      <h4 class="font-bold text-lg mb-3">Transcoding</h4>
      <p class="leading-relaxed mb-6">
        I've built and fine-tuned media transcoding pipelines using tools like FFmpeg and cloud services such as AWS Elemental MediaConvert, automating transcoding tasks and ensuring efficient delivery across a wide range of devices. Maintaining quality is a big priority for me — I work to ensure videos maintain high resolution and perform well, even when network conditions aren't ideal.
      </p>
      <h4 class="font-bold text-lg mb-3">Delivery</h4>
      <p class="leading-relaxed mb-6">
        Smooth, efficient media delivery is essential for a great user experience. I've worked extensively with adaptive bitrate streaming technologies like HLS and DASH to make sure content is optimized for different devices and network conditions. I've also built and integrated Content Delivery Networks (CDNs) on Akamai, Fastly, and AWS CloudFront to reduce latency and offload traffic, ensuring that users can access content quickly and reliably, no matter where they're located.
      </p>
      <h4 class="font-bold text-lg mb-3">Playback</h4>
      <p class="leading-relaxed mb-6">
        For me, optimizing video playback is all about giving users the best experience possible, no matter what device they're on or what their network situation looks like. I've implemented adaptive bitrate (ABR) streaming, which adjusts video quality dynamically based on available bandwidth, providing a smoother, more consistent viewing experience even when network conditions change. I constantly monitor playback performance metrics—things like buffering events and user feedback—to proactively address any issues and ensure that playback remains high-quality at all times.
      </p>
    `,
  },
  {
    id: 'machine-learning-modal',
    category: 'Machine Learning',
    iconName: 'fa6-solid:brain',
    content: `
      <p class="leading-relaxed mb-6">
        My work in machine learning focuses on solving practical problems like video analysis, recommendation systems, film production, and automation through AI/ML models. Over the years, I've collaborated with research teams to take models from development all the way to production, using frameworks like TensorFlow and PyTorch. I've built end-to-end machine learning pipelines, managed model lifecycles, and deployed scalable solutions that handle real-time data processing.
      </p>
      <h4 class="font-bold text-lg mb-3">Frameworks & Tools</h4>
      <p class="leading-relaxed mb-6">
        I've primarily worked with computer vision models like U-Net, GroundingDINO, YOLO, Segment Anything, and VMAF. For training and deploying these models, I use TensorFlow and PyTorch. Whether it's for video analysis, film production, or content recommendation, I ensure the models are optimized for performance and scalability. In addition to using AWS SageMaker for model management, I also work with Weights & Biases and MLflow for experiment tracking and model lifecycle management. For monitoring system-level performance, infrastructure health, and model drift, I lean on DataDog and SageMaker Model Monitor to ensure models stay reliable and continue to meet evolving business needs.
      </p>
      <h4 class="font-bold text-lg mb-3">MLOps & Deployment</h4>
      <p class="leading-relaxed mb-6">
        Managing the full lifecycle of machine learning models requires a solid MLOps strategy. I lean on tools like MLflow, Weights & Biases, Kubernetes, and AWS SageMaker to automate and streamline processes from model training to evaluation and deployment. By setting up robust pipelines, I ensure that models are continuously monitored and retrained as new data becomes available, keeping them adaptable and effective.
      </p>
      <h4 class="font-bold text-lg mb-3">Data Pipelines for ML</h4>
      <p class="leading-relaxed mb-6">
        Building reliable data pipelines is essential to any machine learning project. I work with tools like Apache Kafka, Spark, and Airflow to maintain efficient, real-time data flows that feed into the models. This ensures both training and production data are processed accurately and on time. Reliable, high-performing data pipelines are key to supporting real-time analytics and decision-making, and I continuously monitor them to ensure seamless operation across different environments.
      </p>
    `,
  },
  {
    id: 'data-engineering-modal',
    category: 'Data Engineering',
    iconName: 'fa6-solid:database',
    content: `
      <p class="leading-relaxed mb-6">
        Data engineering has always been a critical part of my work, especially when it comes to building scalable ETL pipelines that support real-time data processing and analytics. I've designed and managed systems that handle large datasets, focusing on high availability, data integrity, and optimizing data flows to power business-critical applications, machine learning models, and reporting systems. Keeping these pipelines reliable, accurate, and high-performing is always top of mind, with continuous monitoring to ensure uptime and performance.
      </p>
      <h4 class="font-bold text-lg mb-3">Data Pipelines</h4>
      <p class="leading-relaxed mb-6">
        I build data pipelines using tools like Apache Kafka, Airflow, and Spark to handle both real-time and batch data processing. My main goal is to ensure that data flows smoothly from source to destination with minimal latency and maximum accuracy. Whether it's supporting analytics, machine learning workflows, or day-to-day business operations, I make sure the pipelines are efficient and reliable. Monitoring and alerting are essential to keeping the systems running smoothly and ensuring real-time data is processed without bottlenecks.
      </p>
      <h4 class="font-bold text-lg mb-3">Data Warehousing</h4>
      <p class="leading-relaxed mb-6">
        I have hands-on experience designing and managing data warehouses using platforms like AWS Redshift and Azure Synapse. My work involves creating efficient schemas, optimizing queries for performance, and ensuring the data is structured to support both transactional and analytical workloads. I keep a close eye on performance metrics and usage patterns, making sure that queries are running efficiently and that data storage is cost-optimized for the long term.
      </p>
      <h4 class="font-bold text-lg mb-3">Data Governance & Quality</h4>
      <p class="leading-relaxed mb-6">
        Maintaining trust in data-driven decisions starts with data quality and governance. I implement data governance frameworks to ensure that data is secure, high-quality, and accessible throughout the pipeline. This includes defining data standards, applying access controls, and setting up quality checks to catch issues early. Continuous monitoring is essential to ensure compliance with governance policies and to maintain data integrity at every stage of the process.
      </p>
    `,
  },
  {
    id: 'security-modal',
    category: 'Security',
    iconName: 'fa6-solid:shield-halved',
    content: `
      <p class="leading-relaxed mb-6">
        Security has always been in the fabric of my work, whether I'm building cloud software, deploying machine learning models, or managing media and data engineering pipelines. I've designed and implemented security strategies that protect sensitive data across various systems, ensuring compliance with industry standards like HIPAA and PCI-DSS. From configuring secure cloud architectures to managing vulnerability assessments and incident response, my goal is always to keep systems secure, reliable, and compliant. Continuous security monitoring has been key to identifying and responding to potential threats proactively.
      </p>
      <h4 class="font-bold text-lg mb-3">Application Security</h4>
      <p class="leading-relaxed mb-6">
        Ensuring security is embedded in the software development process is a key part of my work, starting from the earliest stages of building software. I incorporate security best practices into the codebase, such as secure coding standards, dependency management, and continuous vulnerability assessment. A key aspect of this is generating and maintaining a Software Bill of Materials (SBOM) to ensure full visibility into the open-source components and dependencies used within the software. This helps identify potential risks, such as outdated or vulnerable libraries, before they reach production.
      </p>
      <p class="leading-relaxed mb-6">
        I also use security in the CI/CD process to ensure that code is thoroughly tested and vetted before deployment. Throughout the pipeline, I use tools like Snyk and Veracode to ensure that security checks are automated and performed early in the development cycle.
      </p>
      <h4 class="font-bold text-lg mb-3">Cloud Security</h4>
      <p class="leading-relaxed mb-6">
        Securing cloud environments is one of the core aspects of my work. I focus on practices like role-based access control (RBAC), encryption (at-rest, in-use, and in-transit), and multi-factor authentication (MFA) to protect resources in AWS and Azure environments. I've implemented security measures like IAM roles, key management systems, and secure networking configurations, ensuring that cloud resources are both secure and compliant with industry regulations. Using DataDog and AWS CloudTrail, I'm able to detect potential security incidents early and respond quickly to mitigate them.
      </p>
      <h4 class="font-bold text-lg mb-3">Network Security</h4>
      <p class="leading-relaxed mb-6">
        In terms of network security, I've designed secure network architectures using VPCs, firewalls, and VPNs to ensure data remains protected in transit. My focus has been on zero-trust network principles, where no entity is trusted by default. By setting up continuous monitoring, I ensure that any threats are detected early and mitigated before they escalate. Whether it's securing real-time video streams or ensuring data pipelines are protected, network security plays a critical role in my work across various domains.
      </p>
      <h4 class="font-bold text-lg mb-3">Vulnerability Management & Compliance</h4>
      <p class="leading-relaxed mb-6">
        Managing vulnerabilities and ensuring compliance with standards like NIST, FedRAMP, and SOC 2 has been a big part of my work, especially in regulated industries like government, finance, and healthcare. I've used tools like Snyk, Veracode, and AWS Inspector to identify and remediate security risks in both cloud-based applications and machine learning pipelines. Continuous vulnerability scanning and real-time monitoring have been essential for keeping systems secure and compliant, ensuring rapid response to potential threats as they arise.
      </p>
    `,
  },
];

const showModal = (index: number) => {
  currentModalIndex.value = index;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleNext = () => {
  if (currentModalIndex.value !== null) {
    currentModalIndex.value = (currentModalIndex.value + 1) % modals.length;
  }
};

const handlePrevious = () => {
  if (currentModalIndex.value !== null) {
    currentModalIndex.value = (currentModalIndex.value - 1 + modals.length) % modals.length;
  }
};

const toggleModalExpand = () => {
  isModalExpanded.value = !isModalExpanded.value;
  triggerOverflowCheck.value += 1;
};
</script>
