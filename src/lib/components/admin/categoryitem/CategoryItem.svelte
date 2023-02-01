<script>
	import slugify from 'slugify';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let category;

	$: slug = slugify(category.title).toLowerCase();

	let editOpen = false;
</script>

<tr>
	<th>{category.title}</th>
	<th>{category.slug}</th>
	<th><img class="thumbnail" src={category.imgUrl} alt="" /></th>
	<th class="last"
		><button on:click={() => (editOpen = true)} class="primary outline small flex align"
			><Pencil /></button
		></th
	>
	<th class="last">
		<form class="reset" method="post" action="?/remove">
			<input value={category.id} type="number" name="id" class="hidden" />
			<button type="submit" class="warning outline small flex align"><Delete /></button>
		</form>
	</th>
</tr>

{#if editOpen}
	<dialog open>
		<article>
			<header>
				<hgroup class="flex align justify">
					<h3>Edit {category.title}</h3>
					<a
						href="#close"
						aria-label="Close"
						class="small close flex align secondary outline"
						on:click={() => (editOpen = false)}><Close /></a
					>
				</hgroup>
			</header>
			<form action="?/edit" method="POST" enctype="multipart/form-data">
				<input type="number" class="hidden" name="id" value={category.id} />
				<label for="title">Title</label>
				<input bind:value={category.title} type="text" name="title" required />
				<label for="slug">Slug</label>
				<input bind:value={slug} type="text" name="slug" readonly />
				<label for="image">Image</label>
				<input type="file" name="image" id="image" required />

				<button type="submit">Save</button>
				<button on:click={() => (open = false)} class="secondary">Cancel</button>
			</form>
		</article>
	</dialog>
{/if}

<style>
	.thumbnail {
		height: 40px;
		width: 40px;
		object-fit: cover;
		border-radius: 20px;
	}
	.warning {
		color: red;
		border-color: red;
	}
	.warning:hover {
		color: darkred;
		border-color: darkred;
	}
	.last {
		width: 80px;
		text-align: center;
	}
	.hidden {
		display: none;
	}
</style>
