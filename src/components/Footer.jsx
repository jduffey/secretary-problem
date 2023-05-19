import { FaGithub } from 'react-icons/fa';

export const Footer = () => {
    const githubURL = "https://github.com/jduffey/secretary-problem";

    return (
        <div style={{ textAlign: "center" }}>
            <a
                style={{
                    color: "black",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
                href={githubURL}
                target="_blank"
                rel="noreferrer"
            >
                <FaGithub size={24} />&nbsp;&nbsp;jduffey/secretary-problem
            </a>
        </div>
    );
};
