import { FaGithub } from 'react-icons/fa';

export const Footer = () => {
    const githubURL = "https://github.com/jduffey/secretary-problem";

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
                textAlign: "center",
                margin: "0 0 1em 0",
                padding: "0.5em",
                border: "1px solid black",
                borderRadius: "0.5em",
            }}>
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
        </div>
    );
};
