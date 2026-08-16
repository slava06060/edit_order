<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Order an Edit</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<main class="container">

    <header class="hero">
        <p class="eyebrow">VIDEO EDITING</p>

        <h1>Let's create<br>something insane.</h1>

        <p class="intro">
            Tell me everything about your project.
            The more details you give me, the better I can bring your vision to life.
        </p>
    </header>


    <form id="orderForm" action="submit.php" method="POST" enctype="multipart/form-data">


        <!-- EDIT TYPE -->

        <section class="form-section">

            <div class="section-heading">
                <span>01</span>
                <h2>Edit type</h2>
            </div>

            <div class="cards">

                <label class="option-card">
                    <input type="radio" name="edit_type" value="3D / Cinematic Edit" required>

                    <div>
                        <h3>3D / Cinematic Edit</h3>

                        <p>
                            Advanced 3D scenes, camera movement,
                            environments, objects, lighting and cinematic effects.
                        </p>
                    </div>
                </label>


                <label class="option-card">
                    <input type="radio" name="edit_type" value="Transition Edit">

                    <div>
                        <h3>Transition Edit</h3>

                        <p>
                            Smooth transitions, sync, effects,
                            velocity and creative movement.
                        </p>
                    </div>
                </label>


                <label class="option-card">
                    <input type="radio" name="edit_type" value="3D Detail Edit">

                    <div>
                        <h3>3D Detail Edit</h3>

                        <p>
                            Custom 3D elements made specifically
                            for your project.
                        </p>
                    </div>
                </label>

            </div>

        </section>


        <!-- LENGTH -->

        <section class="form-section">

            <div class="section-heading">
                <span>02</span>
                <h2>Edit length</h2>
            </div>

            <div class="small-options">

                <label>
                    <input type="radio" name="edit_length" value="15 seconds" required>
                    <span>15 secs</span>
                </label>

                <label>
                    <input type="radio" name="edit_length" value="30 seconds">
                    <span>30 secs</span>
                </label>

            </div>

        </section>


        <!-- PROJECT TYPE -->

        <section class="form-section">

            <div class="section-heading">
                <span>03</span>
                <h2>What is this edit for?</h2>
            </div>

            <select name="project_type" required>

                <option value="">Select one</option>

                <option value="Brand">Brand</option>
                <option value="Product">Product</option>
                <option value="Artist">Artist</option>
                <option value="Song">Song</option>
                <option value="Album">Album</option>
                <option value="Music Project">Music Project</option>
                <option value="Fandom Edit">Fandom Edit</option>
                <option value="Other">Other</option>

            </select>

        </section>


        <!-- PLATFORM -->

        <section class="form-section">

            <div class="section-heading">
                <span>04</span>
                <h2>What is this edit for?</h2>
            </div>

            <div class="small-options">

                <label>
                    <input type="radio" name="platform" value="TikTok" required>
                    <span>TikTok</span>
                </label>

                <label>
                    <input type="radio" name="platform" value="Instagram Reel">
                    <span>Instagram Reel</span>
                </label>

                <label>
                    <input type="radio" name="platform" value="YouTube Short">
                    <span>YouTube Short</span>
                </label>

                <label>
                    <input type="radio" name="platform" value="Advertisement">
                    <span>Advertisement</span>
                </label>

                <label>
                    <input type="radio" name="platform" value="Music Promo">
                    <span>Music promo</span>
                </label>

                <label>
                    <input type="radio" name="platform" value="Other">
                    <span>Other</span>
                </label>

            </div>

        </section>


        <!-- FEEL -->

        <section class="form-section">

            <div class="section-heading">
                <span>05</span>
                <h2>What should the edit feel like?</h2>
            </div>

            <textarea
                name="creative_direction"
                placeholder="Describe the mood, aesthetic, colours, energy, references..."
                required
            ></textarea>

        </section>


        <!-- REFERENCES -->

        <section class="form-section">

            <div class="section-heading">
                <span>06</span>
                <h2>Show me your vision</h2>
            </div>

            <h3 class="subheading">Reference edits</h3>

            <p class="help">
                Upload videos or paste TikTok / Instagram links.
            </p>

            <input
                type="url"
                name="reference_link"
                placeholder="https://..."
            >


            <h3 class="subheading">Visual references</h3>

            <p class="help">
                Upload images, screenshots, Pinterest references, etc.
            </p>

            <div class="upload-box">

                <input
                    type="file"
                    name="visual_references[]"
                    multiple
                    accept="image/*"
                >

                <span>Drop images here or click to browse</span>

            </div>

        </section>


        <!-- FOOTAGE -->

        <section class="form-section">

            <div class="section-heading">
                <span>07</span>
                <h2>Footage</h2>
            </div>

            <h3>Do you have the footage ready?</h3>

            <div class="small-options vertical">

                <label>
                    <input type="radio" name="footage_status" value="Yes, everything is ready" required>
                    <span>Yes, everything is ready</span>
                </label>

                <label>
                    <input type="radio" name="footage_status" value="I have some footage">
                    <span>I have some footage</span>
                </label>

                <label>
                    <input type="radio" name="footage_status" value="No footage yet">
                    <span>No footage yet</span>
                </label>

            </div>


            <h3 class="subheading">Upload your footage</h3>

            <div class="upload-box large">

                <input
                    type="file"
                    name="footage[]"
                    multiple
                    accept="video/*"
                >

                <span>
                    Drag & drop footage here
                </span>

            </div>

        </section>


        <!-- AUDIO -->

        <section class="form-section">

            <div class="section-heading">
                <span>08</span>
                <h2>Audio</h2>
            </div>

            <h3>Do you have a specific song/audio?</h3>

            <div class="small-options">

                <label>
                    <input type="radio" name="audio_status" value="Yes" required>
                    <span>Yes</span>
                </label>

                <label>
                    <input type="radio" name="audio_status" value="No, choose something suitable">
                    <span>No, choose something suitable</span>
                </label>

                <label>
                    <input type="radio" name="audio_status" value="I'll send it later">
                    <span>I'll send it later</span>
                </label>

            </div>


            <input
                type="url"
                name="audio_link"
                placeholder="Spotify, YouTube, TikTok or audio link"
            >

        </section>


        <!-- DEADLINE -->

        <section class="form-section">

            <div class="section-heading">
                <span>09</span>
                <h2>Deadline</h2>
            </div>

            <div class="small-options vertical">

                <label>
                    <input type="radio" name="deadline" value="No specific deadline" required>
                    <span>No specific deadline</span>
                </label>

                <label>
                    <input type="radio" name="deadline" value="Within a week">
                    <span>Within a week</span>
                </label>

                <label>
                    <input type="radio" name="deadline" value="3–5 days">
                    <span>3–5 days</span>
                </label>

                <label>
                    <input type="radio" name="deadline" value="1–2 days">
                    <span>1–2 days</span>
                </label>

                <label>
                    <input type="radio" name="deadline" value="As soon as possible">
                    <span>As soon as possible</span>
                </label>

            </div>

        </section>


        <!-- COMMENT -->

        <section class="form-section">

            <div class="section-heading">
                <span>10</span>
                <h2>Anything else?</h2>
            </div>

            <textarea
                name="comment"
                placeholder="Anything I should know about your project?"
            ></textarea>

        </section>


        <!-- SUMMARY -->

        <section class="summary">

            <div class="section-heading">
                <span>11</span>
                <h2>Your project</h2>
            </div>

            <div class="summary-content" id="summary">

                <div>
                    <span>Project type</span>
                    <strong id="summaryProject">—</strong>
                </div>

                <div>
                    <span>Edit style</span>
                    <strong id="summaryStyle">—</strong>
                </div>

                <div>
                    <span>Duration</span>
                    <strong id="summaryDuration">—</strong>
                </div>

                <div>
                    <span>Platform</span>
                    <strong id="summaryPlatform">—</strong>
                </div>

                <div>
                    <span>Deadline</span>
                    <strong id="summaryDeadline">—</strong>
                </div>

            </div>

        </section>


        <button class="submit-button" type="submit">
            SUBMIT PROJECT
            <span>→</span>
        </button>

    </form>

</main>

<script src="script.js"></script>

</body>
</html>