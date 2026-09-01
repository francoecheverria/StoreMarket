<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BannerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        Storage::fake('public');
    }

    public function test_guests_cannot_edit_banners(): void
    {
        $this->get(route('admin.banners.edit'))->assertRedirect(route('login'));
    }

    public function test_non_admins_cannot_edit_banners(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.banners.edit'))
            ->assertForbidden();
    }

    public function test_admin_can_view_banner_settings(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.banners.edit'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/banners/index')
                ->where('maxCount', Banner::MAX_COUNT)
                ->has('banners', 0)
            );
    }

    public function test_admin_can_save_banner_images(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.banners.update'), [
                'slots' => [
                    ['image' => UploadedFile::fake()->image('promo-one.jpg')],
                    ['image' => UploadedFile::fake()->image('promo-two.png')],
                ],
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseCount('banners', 2);
        $this->assertTrue(Storage::disk('public')->exists(Banner::query()->first()->image_path));
    }

    public function test_admin_cannot_save_more_than_five_banners(): void
    {
        $slots = [];

        for ($index = 0; $index < 6; $index++) {
            $slots[] = ['image' => UploadedFile::fake()->image("banner-{$index}.jpg")];
        }

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.banners.update'), ['slots' => $slots])
            ->assertSessionHasErrors('slots');

        $this->assertDatabaseCount('banners', 0);
    }

    public function test_reducing_banner_count_deletes_removed_images(): void
    {
        $this->actingAs(User::factory()->admin()->create());

        $this->post(route('admin.banners.update'), [
            'slots' => [
                ['image' => UploadedFile::fake()->image('keep.jpg')],
                ['image' => UploadedFile::fake()->image('remove.jpg')],
            ],
        ]);

        $kept = Banner::query()->orderBy('sort_order')->first();
        $removed = Banner::query()->orderBy('sort_order')->skip(1)->first();
        $removedPath = $removed->image_path;

        $this->post(route('admin.banners.update'), [
            'slots' => [
                ['id' => $kept->id],
            ],
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseCount('banners', 1);
        $this->assertDatabaseHas('banners', ['id' => $kept->id]);
        $this->assertFalse(Storage::disk('public')->exists($removedPath));
    }

    public function test_home_receives_saved_banners(): void
    {
        Banner::query()->create([
            'image_path' => 'banners/home-promo.jpg',
            'sort_order' => 0,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('home')
                ->has('banners', 1)
                ->where('banners.0.image_url', '/storage/banners/home-promo.jpg')
            );
    }
}
