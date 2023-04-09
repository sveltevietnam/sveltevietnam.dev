<script lang="ts">
  import { GITHUB_LINKS, SOCIAL_LINKS } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';

  import communityShapeEllipse from '../images/community-shape-ellipse.png';
  import communityShapePolygon from '../images/community-shape-polygon.png';
  import communityShapeStar from '../images/community-shape-star.png';
  import { translations } from '../translation';

  export let lang: Language;

  $: t = translations[lang].community;
</script>

<section class="community c-container-design">
  <h2 class="section-title">{t.title}</h2>
  <p class="section-desc mt-6 pc:mt-8">{@html t.description}</p>
  <div class="shapes" role="figure" aria-label="geometric shapes">
    <img class="ellipse" src={communityShapeEllipse} alt="ellipse" width="363" height="403" />
    <img class="polygon" src={communityShapePolygon} alt="polygon" width="308" height="390" />
    <img class="star" src={communityShapeStar} alt="star" width="181" height="181" />
  </div>
  <ul class="ctas divide-border divide-y">
    <li class="pb-4">
      <a
        class="flex items-center justify-between"
        href={SOCIAL_LINKS.discord}
        target="_blank"
        rel="noreferrer"
      >
        <span>{t.ctas.discord}</span>
        <svg inline-src="icon/external-link" />
      </a>
    </li>
    <li class="py-4">
      <a
        class="flex items-center justify-between"
        href={GITHUB_LINKS.ISSUE.CONTRIBUTOR_NOMINATION}
        target="_blank"
        rel="noreferrer"
      >
        <span>{t.ctas.nominate}</span>
        <svg inline-src="icon/external-link" />
      </a>
    </li>
    <li class="pt-4">
      <a
        class="flex items-center justify-between"
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noreferrer"
      >
        <span>{t.ctas.contribute}</span>
        <svg inline-src="icon/external-link" />
      </a>
    </li>
  </ul>
</section>

<style lang="postcss">
  .community {
    --gradient-offset: 200px;

    display: grid;
    grid-template-areas:
      'title'
      'description'
      'shapes'
      'ctas';

    margin-top: 16px;
    padding-top: 133px;
    padding-bottom: 126px;

    background: linear-gradient(
      to bottom,
      theme('colors.design.bg.1'),
      theme('colors.design.bg.2') var(--gradient-offset),
      theme('colors.design.bg.2') calc(100% - var(--gradient-offset)),
      theme('colors.design.bg.1') 100%
    );

    @screen tb {
      --gradient-offset: 200px;

      grid-template-areas:
        'title shapes'
        'description shapes'
        'ctas shapes';
      grid-template-columns: minmax(560px, auto) auto;
      justify-content: space-between;
      margin-top: 27px;
    }
  }

  .section-title {
    grid-area: title;
  }

  .section-desc {
    grid-area: description;

    @screen sp {
      margin-top: 24px;
    }

    @screen tb {
      max-width: 560px;
    }
  }

  .ctas {
    grid-area: ctas;
    margin-top: 30px;

    @screen sp {
      margin-left: 32px;
    }

    @screen tb {
      margin-top: 80px;
    }
  }

  .shapes {
    position: relative;

    grid-area: shapes;

    aspect-ratio: 285 / 277;
    width: clamp(100px, 79.1vw, 285px);
    height: auto;
    margin-left: auto;

    @screen sp {
      margin-top: 20px;
    }

    @screen tb {
      aspect-ratio: 453 / 478;
      width: clamp(100px, 31.5vw, 453px);
      height: auto;
    }

    & img {
      --rotate-x: 0deg;
      --rotate-y: 0deg;
      --rotate-z: 0deg;
      --scale-from: 1;
      --scale-to: 1;

      position: absolute;
      animation: shape 3s ease-in-out alternate infinite;

      &.ellipse {
        --rotate-x: -5deg;
        --rotate-y: 10deg;
        --rotate-z: -3deg;
        --scale-from: 1.02;

        bottom: 0;
        left: 0;
        width: 80%;
        height: auto;
      }

      &.polygon {
        --rotate-x: -4deg;
        --rotate-y: 8deg;
        --rotate-z: 2deg;
        --scale-from: 1.03;

        top: 0;
        left: 3.5%;
        width: 68%;
        height: auto;
      }

      &.star {
        --rotate-x: -10deg;
        --rotate-y: 12deg;
        --rotate-z: -5deg;
        --scale-to: 1.05;

        right: 0;
        bottom: 19.3%;
        width: 40%;
        height: auto;
      }
    }
  }

  @keyframes shape {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0) scale(var(--scale-from));
    }

    100% {
      transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) rotateZ(var(--rotate-z))
        scale(var(--scale-to));
    }
  }
</style>
