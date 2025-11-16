import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Footer from '@/components/layout/Footer.vue';

describe('Footer Component', () => {
  let originalGtag: typeof window.gtag;

  beforeEach(() => {
    originalGtag = window.gtag;
    window.gtag = vi.fn((command: string, action: string, params?: Record<string, unknown>) => {
      window.gtagCalls = window.gtagCalls || [];
      (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>).push({ command, action, params });
    });
  });

  afterEach(() => {
    window.gtag = originalGtag;
    (window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>) = [];
  });

  test('renders with copyright text and current year', async () => {
    const wrapper = mount(Footer);
    await wrapper.vm.$nextTick();

    const footer = wrapper.find('footer');
    expect(footer.exists()).toBe(true);

    const currentYear = new Date().getFullYear();
    const copyrightText = wrapper.text();
    expect(copyrightText.includes(`© ${currentYear} Shawn Hoffman`)).toBeTruthy();
  });

  test('includes social links with proper attributes', async () => {
    const wrapper = mount(Footer);
    await wrapper.vm.$nextTick();

    const links = wrapper.findAll('a');
    expect(links.length).toBeGreaterThan(0);

    const githubLink = links.find(link =>
      link.attributes('href')?.includes('github.com')
    );
    expect(githubLink?.exists()).toBe(true);

    if (githubLink) {
      const ariaLabel = githubLink.attributes('aria-label');
      expect(ariaLabel?.toLowerCase().includes('github')).toBeTruthy();
      expect(githubLink.attributes('rel')).toBe('noopener noreferrer');
    }

    const linkedinLink = links.find(link =>
      link.attributes('href')?.includes('linkedin.com')
    );
    expect(linkedinLink?.exists()).toBe(true);

    if (linkedinLink) {
      const ariaLabel = linkedinLink.attributes('aria-label');
      expect(ariaLabel?.toLowerCase().includes('linkedin')).toBeTruthy();
    }

    const twitterLink = links.find(link =>
      link.attributes('href')?.includes('x.com') || link.attributes('href')?.includes('twitter.com')
    );
    expect(twitterLink?.exists()).toBe(true);

    if (twitterLink) {
      const ariaLabel = twitterLink.attributes('aria-label');
      expect(ariaLabel?.toLowerCase().match(/twitter|x/i)).toBeTruthy();
    }
  });

  test('tracks social link clicks with gtag', async () => {
    const wrapper = mount(Footer);
    await wrapper.vm.$nextTick();

    const socialLinks = wrapper.findAll('a[aria-label]');
    expect(socialLinks.length).toBeGreaterThan(0);

    if (socialLinks.length > 0) {
      const firstLink = socialLinks[0];
      expect(firstLink.exists()).toBe(true);

      await firstLink.trigger('click');
      await wrapper.vm.$nextTick();

      expect(window.gtagCalls).toBeTruthy();
      const gtagCalls = window.gtagCalls as Array<{ command: string; action: string; params?: Record<string, unknown> }>;
      expect(gtagCalls.length).toBeGreaterThan(0);
      expect(gtagCalls[0].command).toBe('event');
    }
  });

  test('has responsive design classes', async () => {
    const wrapper = mount(Footer);
    await wrapper.vm.$nextTick();

    const footer = wrapper.find('footer');
    expect(footer.exists()).toBe(true);

    if (footer.exists()) {
      expect(footer.classes()).toContain('bg-base-100');

      const flexContainer = wrapper.find('div.flex-col') || wrapper.find('div.flex-row');
      expect(flexContainer.exists()).toBe(true);
    }
  });
});
