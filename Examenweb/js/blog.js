import { data } from "./data.js";

let activePage = 1;
const itemsPerPage = 5;

// -----------------------------
// BLOG POSTS
// -----------------------------
function renderBlogPosts(dataSource) {
    const postsWrapper = document.querySelector("#postsContainer");
    if (!postsWrapper || !dataSource.posts) return;

    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visiblePosts = dataSource.posts.slice(startIndex, endIndex);

    const postFragment = document.createDocumentFragment();

    visiblePosts.forEach(postItem => {
        const articleCard = document.createElement("article");

        const thumbnail = document.createElement("img");
        thumbnail.src = postItem.thumbnail;
        thumbnail.alt = postItem.title || "Post Image";

        const contentArea = document.createElement("div");
        contentArea.classList.add("contentRight");

        const title = document.createElement("h3");
        title.textContent = postItem.title;

        const date = document.createElement("h4");
        date.textContent = new Date(postItem.creationDate).toDateString();

        const description = document.createElement("p");
        description.textContent = postItem.description;

        const tagsWrapper = document.createElement("div");

        postItem.tags.forEach(tagItem => {
            const tag = document.createElement("span");
            tag.textContent = tagItem;
            tagsWrapper.appendChild(tag);
        });

        contentArea.append(title, date, description, tagsWrapper);
        articleCard.append(thumbnail, contentArea);
        postFragment.appendChild(articleCard);
    });

    postsWrapper.innerHTML = "";
    postsWrapper.appendChild(postFragment);
}

// -----------------------------
// YOUTUBE VIDEOS
// -----------------------------
function renderYoutubeVideos(dataSource) {
    const youtubeWrapper = document.querySelector("#youtubeContainer");
    if (!youtubeWrapper || !dataSource.youtubeVideos) return;

    const actionBlock = youtubeWrapper.querySelector(".call_action");
    const videoFragment = document.createDocumentFragment();

    dataSource.youtubeVideos.forEach(videoItem => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("youtubeVideo");

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoItem.id}`;
        iframe.title = videoItem.title;

        const videoTitle = document.createElement("h5");
        videoTitle.textContent = videoItem.title;

        videoCard.append(iframe, videoTitle);
        videoFragment.appendChild(videoCard);
    });

    if (actionBlock) {
        youtubeWrapper.insertBefore(videoFragment, actionBlock);
    } else {
        youtubeWrapper.appendChild(videoFragment);
    }
}

// -----------------------------
// PAGINATION SYSTEM
// -----------------------------
const blogPagination = {
    totalPages: 0,
    pageContainer: null,
    previousButtons: null,
    nextButtons: null,

    initialize(dataSource) {
        this.pageContainer = document.querySelector(".count_page");
        this.previousButtons = document.querySelectorAll(".prev_btn");
        this.nextButtons = document.querySelectorAll(".next_btn");

        if (!dataSource.posts || !this.pageContainer) return;

        this.totalPages = Math.ceil(dataSource.posts.length / itemsPerPage);

        this.pageContainer.innerHTML = "";

        for (let pageNumber = 1; pageNumber <= this.totalPages; pageNumber++) {
            const pageItem = document.createElement("p");
            pageItem.textContent = pageNumber;
            pageItem.dataset.page = pageNumber;

            if (pageNumber === activePage) {
                pageItem.classList.add("active");
            }

            pageItem.addEventListener("click", () => {
                activePage = pageNumber;
                this.refresh();
            });

            this.pageContainer.appendChild(pageItem);
        }

        this.previousButtons.forEach(button => {
            button.addEventListener("click", () => {
                if (activePage > 1) {
                    activePage--;
                    this.refresh();
                }
            });
        });

        this.nextButtons.forEach(button => {
            button.addEventListener("click", () => {
                if (activePage < this.totalPages) {
                    activePage++;
                    this.refresh();
                }
            });
        });

        this.refresh();
    },

    refresh() {
        renderBlogPosts(data);

        this.previousButtons.forEach(button =>
            button.classList.toggle("disabled", activePage === 1)
        );

        this.nextButtons.forEach(button =>
            button.classList.toggle("disabled", activePage === this.totalPages)
        );

        this.pageContainer.querySelectorAll("p").forEach(page => {
            page.classList.toggle("active", Number(page.dataset.page) === activePage);
        });
    }
};

// -----------------------------
// INITIAL LOAD
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderBlogPosts(data);
    renderYoutubeVideos(data);
    blogPagination.initialize(data);
});