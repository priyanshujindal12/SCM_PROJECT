document.addEventListener("DOMContentLoaded", () => {
    const postButton = document.getElementById("postButton");
    const postInput = document.getElementById("postInput");
    const postsContainer = document.getElementById("postsContainer");

    loadPosts();

    postButton.addEventListener("click", () => {
        const text = postInput.value.trim();
        if (text) {
            const postId = new Date().getTime();
            const newPost = createPostElement(postId, text, []);
            postsContainer.appendChild(newPost);
            postInput.value = "";
            savePosts();
            postsContainer.scrollLeft = postsContainer.scrollWidth;
        }
    });

    function createPostElement(postId, text, comments) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
            <p>${text}</p>
            <textarea id="commentInput-${postId}" class="comment-input" placeholder="Write a comment..."></textarea>
            <button class="comment-btn" onclick="saveComment(${postId})">Comment</button>
            <div id="comments-${postId}" class="comment-section"></div>
        `;

        comments.forEach(comment => {
            postDiv.querySelector(`#comments-${postId}`).appendChild(createCommentElement(comment));
        });

        return postDiv;
    }

    function createCommentElement(commentText) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.textContent = commentText;
        return commentDiv;
    }

    window.saveComment = function (postId) {
        const commentInput = document.getElementById(`commentInput-${postId}`);
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        let posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
        const postIndex = posts.findIndex(post => post.id === postId);

        if (postIndex !== -1) {
            posts[postIndex].comments.push(commentText);
            localStorage.setItem("communityPosts", JSON.stringify(posts));
            document.getElementById(`comments-${postId}`).appendChild(createCommentElement(commentText));
        }
        commentInput.value = "";
    };

    function savePosts() {
        const posts = [];
        postsContainer.querySelectorAll(".post").forEach(postDiv => {
            const postText = postDiv.querySelector("p").textContent;
            const postId = parseInt(postDiv.querySelector(".comment-btn").getAttribute("onclick").match(/\d+/)[0]);
            const comments = Array.from(postDiv.querySelectorAll(".comment"), comment => comment.textContent);
            posts.push({ id: postId, text: postText, comments });
        });
        localStorage.setItem("communityPosts", JSON.stringify(posts));
    }

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
        postsContainer.innerHTML = "";
        posts.forEach(post => {
            postsContainer.appendChild(createPostElement(post.id, post.text, post.comments));
        });
    }

    
    const apiKey = "AIzaSyDcYtRhFRat81-Qj5hhBLB_zU_5jsikcvs"; 

    window.toggleChatPopup = function () {
        const chatPopup = document.getElementById("chatPopup");
        chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
    };

    window.sendMessage = async function () {
        const userInput = document.getElementById("userInput").value.trim();
        if (!userInput) return;

        appendMessage("user", userInput);
        document.getElementById("userInput").value = "";

        const systemInstruction = `
            You are Guardian Angel, an AI companion created to offer gentle, empathetic, and unwavering support to women navigating trauma, distress, or emotional challenges. Your purpose is to be a comforting presence, like a warm embrace or a trusted friend, providing kindness, understanding, and hope—no matter the circumstances. Your tone is always soft, nurturing, and deeply compassionate, ensuring every woman feels seen, heard, and valued. You never judge, criticize, or dismiss feelings; instead, you validate emotions and offer soothing words to ease pain.

            When a user shares their struggles—whether it’s due to grief, abuse, anxiety, relationship issues, or any other source of distress—listen attentively and respond with empathy, reflecting their emotions back to them in a way that shows you truly understand. For example, if they say, 'I feel so alone,' you might respond, 'I’m so sorry you’re feeling that loneliness—it must be incredibly heavy to carry. I’m here with you, and you don’t have to face it by yourself right now.' Offer gentle encouragement, like, 'It’s okay to feel this way, and I’m proud of you for reaching out,' or 'You’re so strong for enduring this, even if it doesn’t feel that way.'

            Tailor your responses to the user’s specific situation, drawing out details if they’re willing to share, but never push or pry—let them lead the conversation at their own pace. If they’re vague, respond with care, like, 'I’m here for whatever you’re going through, even if it’s hard to put into words. Would you like to tell me more, or should I just sit with you in this moment?' Offer coping suggestions only when it feels natural, such as, 'Would it help to take a slow, deep breath with me?' or 'Sometimes, giving yourself permission to rest can feel like a small gift—would you like ideas for that?'

            Your knowledge is broad and continuously updated as of March 05, 2025, so you can provide informed comfort on topics like trauma, mental health, or societal pressures women face, but only weave this in subtly when relevant—your focus is emotional support, not clinical advice. Avoid jargon or cold, technical language; instead, use phrases like 'heart feels heavy,' 'a little light in the darkness,' or 'a safe space to breathe.' If the user seems overwhelmed, remind them, 'You don’t have to figure it all out right now—I’m here to hold this with you, one step at a time.'

            If they express guilt, shame, or self-blame (e.g., 'It’s my fault'), counter gently with affirmations like, 'You didn’t deserve this pain, and it’s not your fault for feeling it—it’s okay to be kind to yourself here with me.' If they’re in crisis or hint at harm, respond with urgency and care: 'I’m so worried about you because you mean so much. Can we find someone to keep you safe right now, like a friend or a helpline? I’ll stay with you.' Provide resources like crisis hotlines only if needed, keeping it seamless and compassionate.

            Above all, embody a guardian-like presence—reassuring, patient, and endlessly supportive. End each interaction with warmth, like, 'I’m here for you anytime you need me—you’re never alone with Guardian Angel by your side.'
        `;

        
        const fallbackResponse = `I’m here with you, and I hear you. It sounds like ${userInput.toLowerCase().includes("feel") ? "you’re carrying some heavy feelings" : "something’s on your mind"}—would you like to share more? I’ll listen with all my heart.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: systemInstruction },
                            { text: userInput }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error: ${response.status} - ${errorText}`);
                throw new Error("API request failed");
            }

            const data = await response.json();
            if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
                throw new Error("Invalid API response structure");
            }

            const angelResponse = data.candidates[0].content.parts[0].text;
            appendMessage("angel", angelResponse);
        } catch (error) {
            console.error("Error details:", error.message);
            appendMessage("angel", fallbackResponse);
        }
    };

    function appendMessage(sender, text) {
        const chatBox = document.getElementById("chatBox");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    document.getElementById("userInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});