import { StoryAPI } from '../../data/api.js';

export default class DetailPresenter {
  constructor({ view, id }) {
    this.view = view;
    this.id = id;
  }

  // Function to show the story details
  async showDetail() {
    this.view.showLoading();
    try {
      const { story } = await StoryAPI.getStoryDetail(this.id);
      // Reverse geocode to get province based on lat/lon
      story.province = await StoryAPI.reverseGeocode(story.lat, story.lon);
      this.view.renderDetail(story); // Show the story details
    } catch {
      this.view.renderError('Gagal memuat detail cerita.');
    } finally {
      this.view.hideLoading();
    }
  }

  // Get story data to be saved
  async getStory() {
    const { story } = await StoryAPI.getStoryDetail(this.id);
    story.province = await StoryAPI.reverseGeocode(story.lat, story.lon);
    return story; // Return the story object to be saved
  }
}